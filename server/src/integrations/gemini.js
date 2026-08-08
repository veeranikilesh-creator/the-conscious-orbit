import { env } from '../config/env.js';

/* ============================================================
   GEMINI CLIENT — the platform's AI provider.

   Replaces the previous Anthropic integration. Calls the REST API
   with global fetch, so no SDK dependency is needed, and keeps the
   contract every caller relied on: it never throws. A missing key,
   a network failure or an unparseable answer all resolve to null,
   and the caller falls back to its deterministic heuristic.
   ============================================================ */

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 45000;

/* Gemini's structured-output dialect is a subset of JSON Schema and rejects
   these keys outright, so they are stripped before sending. */
const UNSUPPORTED = new Set(['additionalProperties', '$schema', 'default', 'examples', 'title']);

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

  const body = await post(model, {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens,
      responseMimeType: 'application/json',
      responseSchema: toGeminiSchema(schema),
    },
  });
  if (!body) return null;

  const text = extractText(body);
  if (!text) return null;
  try {
    return { data: JSON.parse(text), model };
  } catch {
    return null;
  }
}

/** Plain-text generation for narrative helpers. Resolves to a string or null. */
export async function generateText(systemPrompt, userPrompt, maxOutputTokens = 2048) {
  if (!env.gemini.enabled) return null;
  const body = await post(env.gemini.model, {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens },
  });
  return body ? extractText(body) : null;
}
