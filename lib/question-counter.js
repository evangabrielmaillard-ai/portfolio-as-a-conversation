// Preserve the existing historical total. Never use a read-only token for INCR.
async function questionCounter(command) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
    || (command === 'get' ? process.env.KV_REST_API_READ_ONLY_TOKEN : undefined);
  if (!url || !token || !url.startsWith('https://')) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/${command}/prompt_count`, {
      method: command === 'incr' ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok || data.error) return null;
    if (command === 'get' && data.result === null) return 0;
    if (!['string', 'number'].includes(typeof data.result) || data.result === '') return null;
    const count = Number(data.result);
    return Number.isSafeInteger(count) && count >= 0 ? count : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
module.exports = questionCounter;
