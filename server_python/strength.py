"""Client data strength categorisation — WEAK / MEDIUM / STRONG.

Two different things get banded, and they are deliberately kept apart:

* `score_band()`   — how good the venture scored.
* `data_band()`    — how much evidence the client actually supplied.

A venture can score well on thin data; showing both stops a confident-looking
number from hiding the fact that almost nothing was answered.
"""

BANDS = ('WEAK', 'MEDIUM', 'STRONG')


def band_for(value, weak_below=40, strong_from=70):
    """Generic 0-100 banding used by both helpers and the brand form."""
    try:
        v = float(value or 0)
    except (TypeError, ValueError):
        v = 0
    if v >= strong_from:
        return 'STRONG'
    if v >= weak_below:
        return 'MEDIUM'
    return 'WEAK'


def score_band(score):
    """Band a venture's Orbital/admin score. 70+ strong, 40-69 medium."""
    return band_for(score)


def _filled(value):
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return len(value) > 0
    return True


def completeness_percent(report_json):
    """How much of the intake the client actually filled in, 0-100."""
    clusters = report_json.get('clusters') or {}
    market = clusters.get('market') or {}
    viability = clusters.get('viability') or {}
    launch = clusters.get('launch') or {}
    client = report_json.get('client')
    client = client if isinstance(client, dict) else {}

    answers = [
        client.get('company'), client.get('industry'), client.get('stage'),
        client.get('geography'), client.get('businessModel'), client.get('email'),
        market.get('problem'), market.get('pain'), market.get('wtp'), market.get('icp'),
        viability.get('revenue'), viability.get('margin'), viability.get('costs'),
        viability.get('breakeven'),
        launch.get('geography'), launch.get('gtm'), launch.get('milestones'), launch.get('ask'),
    ]
    if not answers:
        return 0
    return round(len([a for a in answers if _filled(a)]) / len(answers) * 100)


def narrative_words(report_json):
    """Total words across the free-text intake answers.

    The intake promises that a richer description produces a better report;
    this is the measure behind that promise.
    """
    clusters = report_json.get('clusters') or {}
    text = []
    for group in ('market', 'viability', 'launch'):
        for value in (clusters.get(group) or {}).values():
            if isinstance(value, str):
                text.append(value)
    return len(' '.join(text).split())


def data_band(report_json):
    """Band the *evidence*: completeness plus how much the client wrote.

    Reaching STRONG needs both a mostly-complete form and a real narrative —
    50 words is the threshold the intake advertises for a richer analysis.
    """
    completeness = completeness_percent(report_json)
    words = narrative_words(report_json)
    word_score = min(100, round(words / 150 * 100))
    combined = round(completeness * 0.6 + word_score * 0.4)
    return {
        'band': band_for(combined),
        'completeness': completeness,
        'words': words,
        'detailScore': combined,
        'enriched': words >= 50,
    }


def brand_equity_score(pillars, repeat_rate=0, monthly_customers=0):
    """Weighted Indian Brand Equity score from the five pillars plus proof.

    Pillar weights follow the classic Aaker model as applied by IBEF-style
    assessments: loyalty and perceived quality carry the most, with real
    customer behaviour used as corroboration rather than self-report.
    """
    weights = {
        'awareness': 0.2,
        'perceivedQuality': 0.25,
        'associations': 0.15,
        'loyalty': 0.25,
        'distributionReach': 0.15,
    }
    total = 0.0
    for key, weight in weights.items():
        try:
            value = float(pillars.get(key) or 0)
        except (TypeError, ValueError):
            value = 0
        total += max(0, min(100, value)) * weight

    # Behavioural corroboration nudges the self-reported pillars by up to
    # +/-8 points so a brand claiming loyalty with no repeat customers is
    # not rewarded for it.
    try:
        repeat = max(0, min(100, float(repeat_rate or 0)))
    except (TypeError, ValueError):
        repeat = 0
    proof_adjustment = (repeat - 50) / 100 * 8
    if not monthly_customers:
        proof_adjustment -= 4

    return max(0, min(100, round(total + proof_adjustment)))
