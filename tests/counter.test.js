const {test} = require('node:test');
const assert = require('node:assert/strict');
const counter = require('../lib/question-counter');
const chat = require('../api/chat');
const stats = require('../api/stats');
test('counter distinguishes zero, service failure and read-only access', async () => {
  const saved = {...process.env}; const fetch = global.fetch;
  try {
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_TOKEN;
    process.env.KV_REST_API_URL='https://counter.example';
    process.env.KV_REST_API_READ_ONLY_TOKEN='readonly-test';
    let calls=0;
    global.fetch=async()=>{calls++;return {ok:true,json:async()=>({result:null})};};
    assert.equal(await counter('get'),0);
    assert.equal(await counter('incr'),null);
    assert.equal(calls,1);
    global.fetch=async()=>({ok:false,json:async()=>({error:'unavailable'})});
    assert.equal(await counter('get'),null);
    const res={setHeader(k,v){this[k]=v;},status(s){this.code=s;return this;},json(b){this.body=b;}};
    await stats({method:'GET'},res);
    assert.equal(res.code,503);
    assert.equal(res.body.count,null);
    assert.equal(res['Cache-Control'],'no-store');
  } finally { process.env=saved; global.fetch=fetch; }
});
test('successful chat awaits exactly one atomic increment and returns the total', async () => {
  const saved={...process.env}; const fetch=global.fetch;
  try {
    process.env.ANTHROPIC_API_KEY='test';
    process.env.KV_REST_API_URL='https://counter.example';
    process.env.KV_REST_API_TOKEN='write-test';
    let writes=0; let release;
    global.fetch=async(url)=>{
      if(url.includes('anthropic'))return {ok:true,json:async()=>({content:[{type:'text',text:'Answer'}]})};
      assert.equal(url,'https://counter.example/incr/prompt_count');writes++;
      await new Promise(resolve=>{release=resolve;});
      return {ok:true,json:async()=>({result:42})};
    };
    const res={status(s){this.code=s;return this;},json(b){this.body=b;}};
    const pending=chat({method:'POST',headers:{},socket:{remoteAddress:'counter-test'},body:{messages:[{role:'user',content:'Test'}]}},res);
    while(!release) await new Promise(resolve=>setImmediate(resolve));
    assert.equal(res.body,undefined);
    release(); await pending;
    assert.equal(writes,1);assert.equal(res.body.questionCount,42);
    global.fetch=async()=>({ok:false,status:429,json:async()=>({})});
    const failed={status(s){this.code=s;return this;},json(b){this.body=b;}};
    await chat({method:'POST',headers:{},socket:{remoteAddress:'counter-test'},body:{messages:[{role:'user',content:'Test'}]}},failed);
    assert.equal(failed.code,502);assert.equal(writes,1);
  } finally {process.env=saved;global.fetch=fetch;}
});
