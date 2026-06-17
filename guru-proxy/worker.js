// Cloudflare Worker — server-side proxy for the JainQuest "Ask Guru" feature.
//
// Why this exists: the web app is a static client-side site, so any API key it
// used would be visible in the browser. The NVIDIA API key lives ONLY here, as
// an encrypted Worker secret (NVIDIA_API_KEY), and is never sent to the client.
// The app POSTs chat messages to this Worker; the Worker prepends the Guru's
// persona (soul.md), adds the key + model, forwards to NVIDIA's
// OpenAI-compatible endpoint, then returns the reply.
import SOUL from './soul.md';

const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

// Bounds to keep token usage (and cost) predictable.
const MAX_MESSAGES = 20;
const MAX_TOKENS = 1024;

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const origin = request.headers.get('Origin') ?? '';
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors);
    }
    // Block browser calls from origins we don't recognise. (Non-browser
    // clients can spoof Origin; this only stops casual cross-site abuse —
    // the model id and token cap below bound the damage either way.)
    if (origin && allowed.length && !allowed.includes(origin)) {
      return json({ error: 'Origin not allowed' }, 403, cors);
    }
    if (!env.NVIDIA_API_KEY) {
      return json(
        { error: 'Proxy is missing the NVIDIA_API_KEY secret' },
        500,
        cors,
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400, cors);
    }
    const incoming = Array.isArray(body.messages) ? body.messages : null;
    if (!incoming || incoming.length === 0) {
      return json({ error: 'messages[] is required' }, 400, cors);
    }
    // The Guru's persona and topic scope are enforced HERE, server-side. Only
    // user/assistant turns from the client are kept — any system message it
    // sends is dropped, so the persona cannot be overridden from the browser.
    const turns = incoming
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
      .slice(-MAX_MESSAGES);
    const language =
      typeof body.language === 'string' && body.language.trim()
        ? body.language.trim()
        : 'English';
    const messages = [
      { role: 'system', content: `${SOUL}\n\nAlways respond in ${language}.` },
      ...turns,
    ];

    let upstream;
    try {
      upstream = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct',
          messages,
          temperature: 0.4,
          max_tokens: MAX_TOKENS,
          stream: false,
        }),
      });
    } catch {
      return json({ error: 'Could not reach the NVIDIA API' }, 502, cors);
    }

    if (!upstream.ok) {
      const detail = await upstream.text();
      return json(
        {
          error: `NVIDIA API error ${upstream.status}`,
          detail: detail.slice(0, 500),
        },
        502,
        cors,
      );
    }

    const data = await upstream.json();
    let reply = data?.choices?.[0]?.message?.content ?? '';
    // Clean up for the plain-text chat bubble (no markdown renderer there):
    // drop any <think> reasoning blocks, bold/italic ** markers, and # headers.
    reply = reply
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/\*\*/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .trim();

    return json({ reply }, 200, cors);
  },
};

function corsHeaders(origin, allowed) {
  const allow = allowed.includes(origin) ? origin : (allowed[0] ?? '*');
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
