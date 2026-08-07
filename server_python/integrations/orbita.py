"""Orbita AI analysis — port of server/src/integrations/orbita.js.

Provides module-level score analysis and overall venture assessment.
Degrades gracefully: without ANTHROPIC_API_KEY, returns a deterministic
heuristic analysis flagged `live: False`.
"""
import json
import os

from .ai_provider import _model_name
from .spyfu import fetch_domain_intelligence

ORBITA_SYSTEM_PROMPT = """You are Orbita, the AI analysis assistant for The Conscious Orbit.

You receive a venture report with 10 module scores and SpyFu competitor data.
Your job is to critically analyze each module's score and flag inconsistencies.

For each module:
- Compare the score against the module's output data
- Flag if the score seems over-scored or under-scored relative to the data
- Provide reasoning for your assessment

Give an overall assessment:
- confident_go: Strong data, scores are well-supported
- cautious_go: Mostly solid, some concerns to address
- needs_work: Significant issues with scoring or data quality
- pivot_recommended: Fundamental problems with the venture

Rules:
- Be honest and critical — don't inflate scores
- Ground every claim in the supplied data
- If a module is missing data, flag the score as unreliable
- Compare against SpyFu competitor benchmarks where available
- Keep reasoning concise and specific"""

ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "moduleReviews": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "moduleKey": {"type": "string"},
                    "pipelineScore": {"type": "number"},
                    "orbitaScore": {"type": "number"},
                    "assessment": {"type": "string", "enum": ["over_scored", "under_scored", "accurate"]},
                    "reasoning": {"type": "string"},
                },
                "required": ["moduleKey", "pipelineScore", "orbitaScore", "assessment", "reasoning"],
            },
        },
        "overallAssessment": {
            "type": "string",
            "enum": ["confident_go", "cautious_go", "needs_work", "pivot_recommended"],
        },
        "keyConcerns": {"type": "array", "items": {"type": "string"}},
        "keyStrengths": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["summary", "moduleReviews", "overallAssessment", "keyConcerns", "keyStrengths"],
}


def generate_orbita_analysis(report, module_results: list) -> dict:
    """Generate Orbita's analysis of a report's module scores."""
    try:
        import anthropic
    except ImportError:
        return {
            **_heuristic_orbita_analysis(module_results),
            "live": False,
            "model": None,
            "note": "The `anthropic` package is not installed — returning heuristic Orbita analysis.",
        }

    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return {
            **_heuristic_orbita_analysis(module_results),
            "live": False,
            "model": None,
            "note": "ANTHROPIC_API_KEY not configured — returning heuristic Orbita analysis.",
        }

    modules_context = {}
    for mr in module_results:
        modules_context[mr.module_key] = {
            "score": mr.score,
            "output": mr.output,
        }

    try:
        competitor_data = fetch_domain_intelligence(
            report.client.industry if report.client else report.vertical
        )
    except Exception:
        competitor_data = {"note": "SpyFu data unavailable"}

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model=_model_name(),
            max_tokens=16000,
            thinking={"type": "adaptive"},
            output_config={"format": {"type": "json_schema", "schema": ANALYSIS_SCHEMA}},
            system=ORBITA_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": "\n".join([
                        "Analyze this venture report. For each module, compare the pipeline score against the output data and flag inconsistencies.",
                        "",
                        "## Module Data",
                        "```json",
                        json.dumps(modules_context, indent=2),
                        "```",
                        "",
                        "## Competitor Data (SpyFu)",
                        "```json",
                        json.dumps(competitor_data, indent=2),
                        "```",
                        "",
                        "Provide your analysis.",
                    ]),
                }
            ],
        )

        if response.stop_reason == "refusal":
            return {
                **_heuristic_orbita_analysis(module_results),
                "live": False,
                "model": _model_name(),
                "note": "Model declined — returning heuristic analysis.",
            }

        text = next((b.text for b in response.content if b.type == "text"), "")
        parsed = json.loads(text)

        usage = getattr(response, "usage", None)
        return {
            **parsed,
            "live": True,
            "model": response.model,
            "usage": {
                "input_tokens": getattr(usage, "input_tokens", None),
                "output_tokens": getattr(usage, "output_tokens", None),
            },
        }
    except Exception as e:
        return {
            **_heuristic_orbita_analysis(module_results),
            "live": False,
            "model": _model_name(),
            "note": f"Orbita analysis failed ({e}) — returning heuristic analysis.",
        }


def _heuristic_orbita_analysis(module_results: list) -> dict:
    """Deterministic fallback when no AI is available."""
    from scoring import js_round

    module_reviews = []
    modules_context = {}
    for mr in module_results:
        modules_context[mr.module_key] = {
            "score": mr.score,
            "output": mr.output,
        }

    for module_key, data in modules_context.items():
        module_reviews.append({
            "moduleKey": module_key,
            "pipelineScore": data["score"],
            "orbitaScore": data["score"],
            "assessment": "accurate",
            "reasoning": "Heuristic analysis — no AI model available. Pipeline score used as-is.",
        })

    scores = [m["score"] for m in modules_context.values()]
    avg = sum(scores) / len(scores) if scores else 0
    avg = js_round(avg)

    return {
        "summary": f"Heuristic analysis of {len(module_reviews)} modules. Average pipeline score: {avg}/100. No language model was consulted.",
        "moduleReviews": module_reviews,
        "overallAssessment": (
            "confident_go" if avg >= 70
            else "cautious_go" if avg >= 50
            else "needs_work" if avg >= 30
            else "pivot_recommended"
        ),
        "keyConcerns": ["Analysis based on incomplete pipeline data."] if len(module_reviews) < 5 else [],
        "keyStrengths": ["Pipeline scores are generally strong."] if avg >= 70 else [],
    }
