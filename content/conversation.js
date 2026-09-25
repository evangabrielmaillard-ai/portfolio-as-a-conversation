/* Curated public questions. The model may select IDs, never inject chip HTML. */
const Conversation = (() => {
  const rows = [
    ['proud','orders','Quelle réalisation illustre le mieux votre travail ?','Which project best illustrates your work?'],
    ['level','ai','Votre niveau en IA, concrètement ?','How would you describe your AI skills?'],
    ['example','general','Quels usages concrets faites-vous de l’IA ?','Show me what you do with AI'],
    ['broke','louche','Comment avez-vous géré un incident ?','How did you resolve a production incident?'],
    ['orders-how','orders','Comment les commandes arrivent-elles dans le CRM ?','How do orders reach the CRM?'],
    ['orders-scope','orders','Sans intervention humaine : sur quelles étapes ?','Without manual intervention: at which steps?'],
    ['orders-check','orders','Quels contrôles sur les commandes intégrées ?','How do you verify integrated orders?'],
    ['orders-exceptions','orders','Comment traitez-vous les produits spéciaux ?','How do you handle special products?'],
    ['orders-endtoend','orders','Quel est le parcours de la boîte mail au devis client ?','What is the flow from the inbox to the customer quote?'],
    ['orders-make','orders','Quel est le rôle de Make dans ce flux ?','What role does Make play in this flow?'],
    ['own-work','ai','Quelle est votre contribution, et celle de l’IA ?','What did you do yourself, and what did AI do?'],
    ['ai-method','ai','Comment passez-vous du besoin à la réalisation ?','How do you turn an idea into a useful tool?'],
    ['ai-limits','limits','Quelles sont vos limites techniques actuelles ?','Where do your skills stop today?'],
    ['no-automation','limits','Quand déconseillez-vous l’automatisation ?','When do you advise against automation?'],
    ['quote-lines','pipeline','Pourquoi le devis multi-produits posait problème ?','Why were multi-product quotes a problem?'],
    ['quote-detail','pipeline','Présentez le fonctionnement du flux de devis','Show me how the quote flow works'],
    ['quote-human','pipeline','Quelle différence entre commandes, devis et offres ?','How do orders, quotes and sales offers differ?'],
    ['louche-decisions','louche','Quelles corrections après l’incident de contenu ?','What changed after the content incident?'],
    ['louche-incomplete','louche','Comment le produit traite-t-il les informations incomplètes ?','What does your product say when information is missing?'],
    ['louche-role','louche','Quel est votre rôle dans Louche ou Pas ?','What is your role in Louche ou Pas?'],
    ['veille-why','veille','Quel est l’objectif de votre agent de veille subventions ?','What is your grants-monitoring agent for?'],
    ['veille-trust','veille','Comment éviter une recommandation d’aide trompeuse ?','How do you avoid a misleading grant recommendation?'],
    ['image-batch','imagegen','528 images : combien sont vraiment utilisables ?','528 images: how many are actually usable?'],
    ['image-cost','imagegen','Quel gain réel sur les images produit ?','What are the real savings on product images?'],
    ['seo-measure','seo','Comment distinguez-vous progrès et biais de mesure ?','How do you distinguish progress from measurement bias?'],
    ['seo-merchant','seo','Qu’a changé l’ajout de Merchant Center ?','What changed after adding Merchant Center?'],
    ['crm-existing','crm','Comment faites-vous évoluer un CRM existant ?','How do you improve an existing CRM?'],
    ['crm-simple','crm','Quand privilégiez-vous une action groupée à un agent ?','When do you prefer a bulk action over an agent?'],
    ['prospect-data','prospection','Comment utilisez-vous l’IA pour préparer une campagne ?','How do you use AI to prepare a campaign?'],
    ['prospect-quality','prospection','Comment traitez-vous les données incertaines ?','What do you do with uncertain data?'],
    ['prototype-ready','prototype','Comment évaluez-vous la maturité d’un prototype ?','How do you know a prototype is ready?'],
    ['fit','fit','Comment votre expérience répond-elle à notre besoin ?','How does your experience relate to our need?'],
    ['fit-evidence','fit','Quel projet ressemble le plus à notre besoin ?','Which project is closest to our need?'],
    ['background','general','Quel lien entre votre parcours marketing et ces projets ?','How did you move from marketing to these projects?'],
    ['failures','limits','Qu’est-ce qui n’a pas fonctionné ?','What did not work?'],
    ['tools','ai','Comment choisissez-vous les outils et les modèles ?','How do you choose tools and models?']
  ];
  const catalog=rows.map(([id,topic,fr,en])=>({id,topic,fr,en}));
  const topics=new Set(catalog.map(q=>q.topic));
  const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const panelTopics={orders:'orders',pipeline:'pipeline',offres:'pipeline',agents:'ai',ai:'ai',veille:'veille',imagegen:'imagegen',louche:'louche',veilleagent:'louche',seo:'seo',matcher:'crm',prospection:'prospection',arbitrages:'limits',failures:'limits',cv:'general',career:'general'};
  function topicForPanel(panel){return panelTopics[panel] || null;}
  function detectTopic(text,fallback='general') {
    const t=normalize(text);
    const patterns=[['orders',/commandes?|orders?|plus fier|most proud/],['pipeline',/devis|quotes?|offres? commerciales|sales offers/],['louche',/louche|incident|production issue|arnaque|scam/],['imagegen',/images?|visuels?|528/],['veille',/subvention|grants?|veille/],['seo',/seo|merchant|mesure|measurement|trafic/],['prospection',/prospect|lemlist|campagne|campaign/],['prototype',/prototype/],['crm',/crm|pipedrive/],['limits',/limites?|skills stop|competences|pas fonctionne|did not work/],['fit',/poste|recrut|our need|notre besoin|job|role/],['ai',/niveau|level|toi meme|yourself|modeles?|models?|outils?|tools?/]];
    return patterns.find(([,pattern])=>pattern.test(t))?.[0] || fallback;
  }
  function pick({topic='general',asked=[],seen=[],preferred=[],count=3,landing=false}={}) {
    const askedSet=new Set(asked.map(normalize));
    const seenSet=new Set(seen);
    const eligible=catalog.filter(q=>![q.fr,q.en,q.id].some(s=>askedSet.has(normalize(s))));
    const preferredIds=Array.isArray(preferred)?preferred:[];
    const initial=['proud','level','example','broke'];
    const scored=eligible.map((q,index)=>({q,score:
      (seenSet.has(q.id)?0:100) +
      (preferredIds.includes(q.id)?60-preferredIds.indexOf(q.id):0) +
      (landing&&initial.includes(q.id)?40-initial.indexOf(q.id):0) +
      (!landing&&q.topic===topic?40:0) - index/100
    })).sort((a,b)=>b.score-a.score);
    if(landing) {
      const chosen=[];
      for(const {q} of scored) {
        if(chosen.length>=count)break;
        if(!chosen.some(x=>x.topic===q.topic))chosen.push(q);
      }
      for(const {q} of scored) {if(chosen.length>=count)break;if(!chosen.includes(q))chosen.push(q);}
      return chosen;
    }
    // Keep two topic-specific directions even when other topics are fresher.
    const relevant=scored.filter(x=>x.q.topic===topic || preferredIds.includes(x.q.id));
    const selected=relevant.slice(0,Math.min(2,count)).map(x=>x.q);
    if(selected.length<count) {
      const bridge=scored.find(x=>x.q.topic!==topic && preferredIds.includes(x.q.id) && !selected.includes(x.q))
        || scored.find(x=>x.q.topic!==topic && !selected.includes(x.q));
      if(bridge)selected.push(bridge.q);
    }
    for(const {q} of scored) {if(selected.length>=count)break;if(!selected.some(x=>x.id===q.id))selected.push(q);}
    return selected;
  }
  function decodeReply(raw) {
    const fallback={response:raw,topic:null,panel:null,suggestions:[],recruiter:false,role:''};
    let parsed;
    try{parsed=JSON.parse(raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{return fallback;}
    if(!parsed || typeof parsed!=='object' || Array.isArray(parsed))return fallback;
    const response=typeof parsed.response==='string'?parsed.response:typeof parsed.intro==='string'?parsed.intro:null;
    if(response===null)return {...fallback,response:'',panel:typeof parsed.panel==='string'?parsed.panel:null};
    return {response,topic:topics.has(parsed.topic)?parsed.topic:null,panel:typeof parsed.panel==='string'?parsed.panel:null,
      suggestions:Array.isArray(parsed.suggestions)?[...new Set(parsed.suggestions.filter(id=>catalog.some(q=>q.id===id)))].slice(0,3):[],
      recruiter:parsed.recruiter===true,role:typeof parsed.role==='string'?parsed.role.slice(0,100):''};
  }
  return {updated:'2026-09-25',catalog,normalize,detectTopic,topicForPanel,pick,decodeReply};
})();
if(typeof module!=='undefined')module.exports=Conversation;
