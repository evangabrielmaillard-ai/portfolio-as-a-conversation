const fs = require('node:fs');
const path = require('node:path');
const cases = require('../content/portfolio.js');
const professionalContext = require('../content/professional-context.json');
const conversation = require('../content/conversation.js');
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, '../prompts/system-prompt.txt'), 'utf8') + '\nCAS DOCUMENTÉS\n' + JSON.stringify(cases) + '\nCONTEXTE PROFESSIONNEL\n' + JSON.stringify(professionalContext) + '\nQUESTIONS DE RELANCE AUTORISÉES\n' + JSON.stringify(conversation.catalog.map(({id,topic,fr,en})=>({id,topic,fr,en})));

const questionCounter = require('../lib/question-counter');

const rateLimit = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 20;
  const entry = rateLimit.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  rateLimit.set(ip, entry);
  if (rateLimit.size > 1000) {
    for (const [k, v] of rateLimit.entries()) {
      if (now > v.resetAt) rateLimit.delete(k);
    }
  }
  return entry.count <= maxRequests;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Rate limit atteint. Réessayez dans une heure.' });

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Payload invalide.' });
  if (messages.length === 0 || messages.length > 20) return res.status(400).json({ error: 'Payload invalide.' });
  for (const msg of messages) {
    if (!msg || typeof msg.role !== 'string' || typeof msg.content !== 'string') return res.status(400).json({ error: 'Payload invalide.' });
    if (!['user', 'assistant'].includes(msg.role)) return res.status(400).json({ error: 'Payload invalide.' });
    if (msg.content.length > 4000) return res.status(400).json({ error: 'Payload invalide.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.error('[chat] ANTHROPIC_API_KEY manquante'); return res.status(503).json({ error: 'Service temporairement indisponible.' }); }

  let timeout;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 650, system: SYSTEM_PROMPT, messages }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) { console.error('[chat] Erreur Anthropic', response.status, data?.error?.type); return res.status(502).json({ error: 'Erreur de service. Réessayez.' }); }

    const questionCount = await questionCounter('incr');
    return res.status(200).json({ ...data, questionCount });

  } catch (error) {
    if (error.name === 'AbortError') { console.error('[chat] Timeout'); return res.status(504).json({ error: 'Délai dépassé. Réessayez.' }); }
    console.error('[chat] Exception', error.message);
    return res.status(500).json({ error: 'Erreur inattendue. Réessayez.' });
  } finally {
    clearTimeout(timeout);
  }
};
