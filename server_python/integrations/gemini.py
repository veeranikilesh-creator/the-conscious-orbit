"""Gemini client — the platform's AI provider.

Replaces the previous Anthropic integration. Speaks the REST API directly
through urllib so no extra SDK dependency is needed, and keeps the same
contract every caller relied on: it never raises. A missing GEMINI_API_KEY,
a network failure or an unparseable answer all return `None`, and the
caller falls back to its deterministic heuristic.

Env:
  GEMINI_API_KEY  — required for live answers
  GEMINI_MODEL    — defaults to gemini-2.0-flash
"""
import json
import os
import urllib.error
import urllib.request

BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
TIMEOUT_SECONDS = 45

# Gemini's structured-output schema dialect is a subset of JSON Schema: it
# rejects these keys outright, so they are stripped before sending.
_UNSUPPORTED = {"additionalProperties", "$schema", "default", "examples", "title"}


def model_name():
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


def enabled():
    return bool(os.getenv("GEMINI_API_KEY"))


def _to_gemini_schema(schema):
    """Translate a JSON Schema into the shape Gemini accepts."""
    if not isinstance(schema, dict):
        return schema
    out = {}
    for key, value in schema.items():
        if key in _UNSUPPORTED:
            continue
        if key == "type" and isinstance(value, str):
            out["type"] = value.upper()
        elif key == "properties" and isinstance(value, dict):
            out["properties"] = {k: _to_gemini_schema(v) for k, v in value.items()}
        elif key == "items":
            out["items"] = _to_gemini_schema(value)
        elif key == "enum":
            # Gemini only supports enums on strings.
            out["enum"] = [str(v) for v in value]
            out.setdefault("type", "STRING")
        else:
            out[key] = value
    # An integer enum becomes a string enum above; keep the type consistent.
    if out.get("enum") and out.get("type") not in (None, "STRING"):
        out["type"] = "STRING"
    return out


def generate_json(system_prompt, user_prompt, schema, max_output_tokens=8192):
    """Ask Gemini for a JSON object matching `schema`.

    Returns {'data': dict, 'model': str} on success, or None on any failure
    (no key, network error, refusal, unparseable output) so callers can fall
    back to their heuristic path.
    """
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return None

    model = model_name()
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": max_output_tokens,
            "responseMimeType": "application/json",
            "responseSchema": _to_gemini_schema(schema),
        },
    }

    request = urllib.request.Request(
        f"{BASE_URL}/{model}:generateContent?key={api_key}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            body = json.loads(response.read().decode("utf-8"))
    except Exception:
        return None

    try:
        candidate = (body.get("candidates") or [])[0]
        # A safety block leaves no parts — treat it as a failure, not a crash.
        parts = (candidate.get("content") or {}).get("parts") or []
        text = "".join(p.get("text", "") for p in parts).strip()
        if not text:
            return None
        return {"data": json.loads(text), "model": model}
    except Exception:
        return None


def generate_text(system_prompt, user_prompt, max_output_tokens=2048):
    """Plain-text generation for narrative helpers. Returns a string or None."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return None

    model = model_name()
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": max_output_tokens},
    }
    request = urllib.request.Request(
        f"{BASE_URL}/{model}:generateContent?key={api_key}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            body = json.loads(response.read().decode("utf-8"))
        parts = ((body.get("candidates") or [])[0].get("content") or {}).get("parts") or []
        return "".join(p.get("text", "") for p in parts).strip() or None
    except Exception:
        return None
