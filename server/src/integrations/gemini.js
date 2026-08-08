import { env } from '../config/env.js';

/* ============================================================
   GEMINI CLIENT — the platform's AI provider.

   Calls the REST API with global fetch, so no SDK dependency is
   needed, and keeps the contract every caller relies on: it never
   throws. A missing key, a network failure or an unparseable
   answer all resolve to null, and the caller falls back to its
   deterministic heuristic.

   Two API generations are supported because the structured-output
   shape moved:
     Gemini 3.x   — generationConfig.responseFormat.text.{mimeType, schema}
     Gemini <=2.x — generationConfig.responseMimeType + responseSchema

   The generation is detected from the model name, and a failed
   request is retried once with the other shape, so pointing
   GEMINI_MODEL at an older model keeps working unchanged.

   Gemini 3 warns explicitly against lowering `temperature` — it
   causes looping and degraded reasoning — so the default is left
   alone for 3.x and only set for the older models.
   ============================================================ */

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 60000;

/* Gemini's structured-output dialect is a subset of JSON Schema and rejects
   these keys outright, so they are stripped before sending. */
const UNSUPPORTED = new Set(['additionalProperties', '$schema', 'default', 'examples', 'title']);

/** True for gemini-3.x and anything above it. */
export function isGemini3OrNewer(model) {
  const name = String(model || '').toLowerCase();
  if (!name.startsWith('gemini-')) return false;
  const major = Number.parseFloat(name.slice('gemini-'.length).split('-')[0]);
  return Number.isFinite(major) && major >= 3;
}

/** Translate a JSON Schema into the shape Gemini accepts. */
export function toGeminiSchema(schema) {
  if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) return schema;

  const out = {};
  for (const [key, value] of Object.entries(schema)) {
    if (UNSUPPORTED.has(key)) continue;
    if (key === 'type' && typeof value === 'string') out.type = value.toUpperCase();
    else if (key === 'properties') {
      out.properties = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, toGeminiSchema(v)])
      );
    } else if (key === 'items') out.items = toGeminiSchema(value);
    else if (key === 'enum') {
      // Gemini only supports enums on strings.
      out.enum = value.map((v) => String(v));
      out.type ??= 'STRING';
    } else out[key] = value;
  }
  if (out.enum && out.type && out.type !== 'STRING') out.type = 'STRING';
  return out;
}

/** generationConfig for a structured-JSON request. */
function jsonConfig(schema, maxOutputTokens, modern) {
  const geminiSchema = toGeminiSchema(schema);
  if (modern) {
    // Gemini 3+: nested responseFormat, temperature left at its default.
    return {
      maxOutputTokens,
      responseFormat: { text: { mimeType: 'application/json', schema: geminiSchema } },
    };
  }
  return {
    maxOutputTokens,
    temperature: 0.2,
    responseMimeType: 'application/json',
    responseSchema: geminiSchema,
  };
}

async function post(model, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/${model}:generateContent?key=${env.gemini.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Pull the text out of a candidate. A safety block leaves no parts. */
function extractText(body) {
  const parts = body?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text ?? '').join('').trim();
  return text || null;
}

/**
 * Ask Gemini for a JSON object matching `schema`.
 * @returns {Promise<{data: object, model: string} | null>} null on any failure.
 */
export async function generateJson(systemPrompt, userPrompt, schema, maxOutputTokens = 8192) {
  if (!env.gemini.enabled) return null;
  const model = env.gemini.model;

  const base = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
  };

  // Try the shape matching the model, then the other one — so an unexpected
  // model generation still gets a live answer.
  const modernFirst = isGemini3OrNewer(model);
  for (const modern of [modernFirst, !modernFirst]) {
    const body = await post(model, {
      ...base,
      generationConfig: jsonConfig(schema, maxOutputTokens, modern),
    });
    if (!body) continue;
    const text = extractText(body);
    if (!text) continue;
    try {
      return { data: JSON.parse(text), model };
    } catch {
      continue;
    }
  }
  return null;
}

/** Plain-text generation for narrative helpers. Resolves to a string or null. */
export async function generateText(systemPrompt, userPrompt, maxOutputTokens = 2048) {
  if (!env.gemini.enabled) return null;
  const model = env.gemini.model;

  const generationConfig = { maxOutputTokens };
  if (!isGemini3OrNewer(model)) generationConfig.temperature = 0.3;

  const body = await post(model, {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig,
  });
  return body ? extractText(body) : null;
}
