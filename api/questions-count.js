const questionCounter = require('../lib/question-counter');
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const count = await questionCounter('get');
  if (count === null) return res.status(503).json({ count: null, available: false });
  return res.status(200).json({ count, available: true });
};
