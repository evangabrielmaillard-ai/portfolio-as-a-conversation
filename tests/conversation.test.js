const {test}=require('node:test');
const assert=require('node:assert/strict');
const c=require('../content/conversation');
test('landing rotates without repeating the visible set',()=>{
 const first=c.pick({landing:true,count:4});
 assert.deepEqual(first.map(q=>q.id),['proud','level','example','broke']);
 const next=c.pick({landing:true,count:4,seen:first.map(q=>q.id)});
 assert.ok(next.every(q=>!first.some(p=>p.id===q.id)));
});
test('orders remain distinct from quotes and followups keep relevant depth',()=>{
 assert.equal(c.detectTopic('intégration des commandes au CRM'),'orders');
 assert.equal(c.detectTopic('devis multi-produits'),'pipeline');
 const questions=c.pick({topic:'orders',asked:[c.normalize(c.catalog.find(q=>q.id==='proud').fr)],seen:['orders-how']});
 assert.equal(questions.length,3);
 assert.ok(questions.slice(0,2).every(q=>q.topic==='orders'));
 assert.ok(questions.every(q=>q.id!=='proud'));
});
test('asked questions are suppressed across languages and model suggestions are allowlisted',()=>{
 const q=c.catalog.find(q=>q.id==='orders-check');
 const picked=c.pick({topic:'orders',asked:[q.fr],preferred:['orders-check','<script>','orders-scope']});
 assert.ok(picked.every(x=>x.id!=='orders-check'));
 const decoded=c.decodeReply('```json\n'+JSON.stringify({response:'Exemple {concret}',topic:'orders',suggestions:['orders-how','orders-how','invented','<img onerror=x>'],recruiter:true,role:{bad:true}})+'\n```');
 assert.deepEqual(decoded.suggestions,['orders-how']);
 assert.equal(decoded.response,'Exemple {concret}');
 assert.equal(decoded.role,'');
 assert.equal(decoded.topic,'orders');
 assert.equal(c.decodeReply('Réponse simple').response,'Réponse simple');
});
test('knowledge distinguishes execution, prototype and proposals',()=>{
 const data=require('../content/professional-context.json');
 assert.ok(data.facts.some(f=>f.topic==='orders'&&f.status==='confirmed_by_evan'));
 assert.ok(data.facts.some(f=>f.topic==='prototype'&&f.status==='prototype'));
 assert.ok(data.facts.some(f=>f.topic==='crm'&&f.status==='proposal_not_verified_deployed'));
});
