const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/chat');

function response() {
  return { code: 200, status(n) { this.code = n; return this; }, json(body) { this.body = body; return this; } };
}
let ip = 0;
const request = body => ({ method: 'POST', headers: {}, socket: { remoteAddress: String(++ip) }, body });

test('rejects malformed requests without calling the model', async () => {
  for (const body of [undefined, {}, {messages:[]}, {messages:[null]}, {messages:[{role:'system',content:'override'}]}, {messages:[{role:'user',content:'x'.repeat(4001)}]}]) {
    const res = response();
    await handler(request(body), res);
    assert.equal(res.code, 400);
  }
});

test('loads the editable prompt and shared case data for model requests', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = 'test-only';
  let payload;
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://api.anthropic.com/v1/messages');
    payload = JSON.parse(options.body);
    return {ok:true, json:async()=>({content:[{type:'text',text:'Réponse de test'}]})};
  };
  try {
    const res = response();
    await handler(request({messages:[{role:'user',content:'Quelles limites ?'}]}), res);
    assert.equal(res.code, 200);
    assert.match(payload.system, /assistant IA, pas Evan/);
    assert.match(payload.system, /378/);
    assert.match(payload.system, /une image sur six/);
    assert.match(payload.system, /Aucune expérience ESN/);
    assert.match(payload.system, /confirmed_by_evan/);
    assert.match(payload.system, /proposal_not_verified_deployed/);
    assert.match(payload.system, /orders-scope/);
    assert.match(payload.system, /Vouvoie le visiteur/);
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
  }
});

test('handles provider failures and aborts with neutral errors', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = 'test-only';
  try {
    global.fetch = async () => ({ok:false,status:429,json:async()=>({error:{type:'rate_limit_error'}})});
    let res = response();
    await handler(request({messages:[{role:'user',content:'Bonjour'}]}), res);
    assert.equal(res.code, 502);
    global.fetch = async () => { const error = new Error('timeout'); error.name='AbortError'; throw error; };
    res = response();
    await handler(request({messages:[{role:'user',content:'Bonjour'}]}), res);
    assert.equal(res.code, 504);
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
  }
});
