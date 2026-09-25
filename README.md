# portfolio-as-a-conversation

> Un portfolio qui répond à la place d'un CV.

## Parcours de lecture et maintenance

L’accueil est centré sur la conversation : présentation courte, photo et quatre
questions d’amorce. « D’autres questions » renouvelle les suggestions sans appel
au modèle. Les relances suivent le sujet et excluent les questions déjà posées.
Les fiches apparaissent à la demande pendant la conversation.

Les cas présentent le problème, les choix, le fonctionnement et les limites. Le contact
prépare un email dans la messagerie du visiteur, sans envoi automatique ni délai
de réponse promis. La comparaison à un poste confronte les besoins aux faits
documentés et signale les points à vérifier en entretien. La contribution
personnelle n’est affichée dans une fiche que si le champ `contribution` est
renseigné avec des informations confirmées.

- `content/portfolio.js` : fiches bilingues partagées par les panneaux et le prompt serveur.
- `content/professional-context.json` : contexte professionnel sélectionné, statuts et limites d’attribution. Ce fichier est public ; aucun secret ni historique brut.
- `content/conversation.js` : questions bilingues, sélection contextuelle, exclusion des répétitions et décodage des réponses JSON. Le modèle ne peut sélectionner que des identifiants connus.
- `prompts/system-prompt.txt` : règles de réponse, profil et navigation, réellement chargés par l’API.
- `index.html` : interface et panneaux secondaires existants.
- `node --test tests/*.test.js` : validation du payload, chargement du prompt et gestion des erreurs fournisseur. Aucun appel payant dans ces tests.

Le flux commandes → CRM, confirmé par Evan comme autonome sur l’intégration,
couvre aussi le devis CRM sur modèle et son renvoi au client, orchestrés avec Make.
Les métriques historiques d’autres fiches ne lui sont pas transférées sans
confirmation. Les règles d’ajustement et le traitement des exceptions restent à documenter. Le niveau IA est présenté par des usages concrets
avec assistance IA, sans revendiquer l’écriture manuelle de tout le code ni une
expertise en recherche ML.

Les métriques des nouveaux cas sont déclaratives. Leurs périodes, méthodes de
calcul et autorisations de publication doivent être confirmées avant mise en ligne.
Les panneaux secondaires hérités nécessitent encore une revue éditoriale complète.
Ne jamais enregistrer de secrets dans ce dépôt public, y compris dans le prompt.

**[→ Voir le site en live](https://www.evangabrielmaillard.com)** · [English version below](#english)

---

## Ce que c'est

La plupart des portfolios sont des pages statiques. Celui-ci est une conversation.

Au lieu de lire un CV, le visiteur pose des questions. Le chatbot répond comme un consultant — en reformulant le problème, en identifiant les vrais leviers, en s'appuyant sur des réalisations réelles avec des chiffres.

Construit en **une soirée + une matinée**. Zéro ligne de code écrite manuellement.

---

## Stack

```
index.html          → site complet (HTML + CSS + JS vanilla, fichier unique)
api/chat.js         → Vercel Serverless Function (proxy API Anthropic)
system-prompt.txt   → system prompt complet, lu au runtime par api/chat.js
vercel.json         → headers de sécurité + config déploiement
```

| Composant | Technologie |
|-----------|------------|
| Frontend | HTML / CSS / JS vanilla — aucun framework |
| IA | API Anthropic (Claude Haiku) |
| Déploiement | GitHub → Vercel (CI/CD automatique) |
| Coût mensuel | ~0–5€ selon le trafic |

---

## Fonctionnalités

**Chatbot dual-mode**
- Mode CV : répond sur le parcours, les projets, les compétences
- Mode consultant : reformule le problème → identifie la cause réelle → 2-3 leviers → ancrage terrain chiffré → limite honnête → question utile

**16 panneaux dépliables** déclenchés par le chat
- Prospection B2B (chiffres réels 2025 — barres animées)
- Pipeline de devis automatisé Make + GPT-4
- Agent IA — offres commerciales (email → CRM, 272 offres, 0 saisies manuelles)
- Architecture agents spécialisés (Agent CRM + Agent Produit, JSON strict)
- Scripts Python métier (19 outils Tkinter)
- Automatisations Make (5 scénarios, 600+ exécutions)
- Générateur d'images IA (gpt-image-1, 176 refs, 21h économisées)
- Carnetto SaaS, parcours pro, vue synthétique, plan 90 jours
- Ce qui n'a pas marché (Feedcasse, Carnetto — récit honnête)

**UX progressive**
- Frappe progressive des réponses mot par mot
- Indicateur de réflexion rotatif ("Analyse...", "Formule...", "Réfléchit...")
- Compteur de temps de réponse sous chaque bulle
- Questions dynamiques sous chaque réponse (jamais les mêmes)
- Menu persistant qui s'enrichit au fil des panneaux consultés
- Mode sombre / clair, bilingue FR / EN
- Reconnaissance vocale (Web Speech API)
- Mode recruteur : détecte si le visiteur recrute et adapte le discours
- CTA LinkedIn après 4 échanges

**Easter eggs**
- Commentaire caché dans le code source avec indice Konami
- Konami code (↑↑↓↓←→←→BA) → panneau secret
- Titre d'onglet dynamique quand la fenêtre est en arrière-plan

**Sécurité**
- Clé API côté serveur uniquement (variable Vercel)
- System prompt dans `prompts/system-prompt.txt` — lu au runtime, non exposé côté client
- Rate limiting 20 messages/heure par IP en mémoire locale à chaque instance. Redis sert au compteur, pas à cette limite. Un plafond partagé reste à implémenter pour limiter les coûts en production.
- Échappement HTML systématique des entrées utilisateur et des sorties LLM (anti-XSS)
- Validation stricte du payload (taille, type, longueur de chaque message)
- Timeout explicite sur l'appel Anthropic (15s)
- Messages d'erreur neutres côté client, détails en logs serveur uniquement
- Headers de sécurité via `vercel.json` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

---

## Déployer votre propre version

### 1. Cloner le repo

```bash
git clone https://github.com/evangabrielmaillard-ai/portfolio-as-a-conversation.git
cd portfolio-as-a-conversation
```

### 2. Déployer sur Vercel

Connecter le repo GitHub à [vercel.com](https://vercel.com) — déploiement automatique en 3 clics.

### 3. Ajouter la variable d'environnement

Dans Vercel → Settings → Environment Variables :

```
ANTHROPIC_API_KEY = sk-ant-...
```

Le system prompt est lu depuis `prompts/system-prompt.txt` et enrichi avec `content/portfolio.js`. Il n’existe plus de copie de secours divergente dans l’API. La taille reste soumise aux limites de contexte et influe sur le coût des requêtes. Le cache de prompt n’est pas activé par cette modification.

---

## Personnaliser

| Élément | Où le modifier |
|---------|---------------|
| Profil, réalisations, triggers panneaux | `system-prompt.txt` |
| Contenu des panneaux | Fonctions `buildProjects()`, `buildCareer()`, etc. dans `index.html` |
| Suggestions d'accueil | Balises `<button class="chip">` dans `index.html` |
| Punchlines | Tableau `const TAGLINES` dans `index.html` |
| Questions de relance | Objet `FOLLOWUP_POOLS` dans `index.html` |

---

## Choix techniques & limites assumées

**Pourquoi vanilla JS / fichier unique**
Choix délibéré pour un projet solo. Pas de build step, pas de dépendances, déploiement immédiat. Limite : le fichier grossit avec le contenu (~100KB). Au-delà, séparer CSS et JS aurait du sens.

**Pourquoi Vercel Serverless**
Zéro gestion d'infrastructure. La fonction `/api/chat` est le seul composant serveur — elle gère le rate limiting, la validation et le proxy Anthropic. Limite : le rate limiting est en mémoire par instance, non partagé entre instances (acceptable pour un portfolio).

**Pourquoi `system-prompt.txt` dans le repo**
Vercel limite les variables d'environnement à ~4KB dans l'interface web. Le system prompt complet (~9KB) dépasse cette limite. La solution retenue : le fichier est lu au runtime par `api/chat.js` via `fs.readFileSync`. Il est versionné avec le code, modifiable comme n'importe quel fichier, sans limite de taille.

**Ce qui n'a pas été industrialisé volontairement**
- Pas de base de données (inutile pour ce cas d'usage)
- Pas de tests automatisés
- Pas de monitoring avancé (Vercel Analytics suffit)
- Le bilingue FR/EN est une feature UX, pas une architecture éditoriale distincte
- Le parsing JSON des réponses LLM se fait par regex — fiable dans la grande majorité des cas, documenté comme limite

**Ce que je ferais en V2**
- Séparer CSS et JS en fichiers dédiés si le projet continue de grandir
- Streaming des réponses pour une UX encore plus fluide

---

## Licence

MIT — libre de réutiliser, adapter, forker.

---
---

<a name="english"></a>

# portfolio-as-a-conversation

> A portfolio that answers instead of a CV.

**[→ See the live site](https://www.evangabrielmaillard.com)**

---

## What it is

Most portfolios are static pages. This one is a conversation.

Instead of reading a CV, the visitor asks questions. The chatbot responds like a consultant — reformulating the problem, identifying real levers, grounding every answer in actual results with numbers.

Built in **one evening + one morning**. Zero lines of code written manually.

---

## Stack

```
index.html          → full site (HTML + CSS + vanilla JS, single file)
api/chat.js         → Vercel Serverless Function (Anthropic API proxy)
system-prompt.txt   → full system prompt, read at runtime by api/chat.js
vercel.json         → security headers + deployment config
```

| Component | Technology |
|-----------|-----------| 
| Frontend | HTML / CSS / vanilla JS — no framework |
| AI | Anthropic API (Claude Haiku) |
| Deployment | GitHub → Vercel (automatic CI/CD) |
| Monthly cost | ~€0–5 depending on traffic |

---

## Features

**Dual-mode chatbot**
- CV mode: answers about career, projects, skills
- Consultant mode: reformulates the problem → identifies the real cause → 2-3 levers → grounded in real data → honest limitation → useful follow-up question

**16 expandable panels** triggered by chat
- B2B prospecting (real 2025 data — animated bars)
- Automated quote pipeline Make + GPT-4
- AI agent — commercial quotes (email → CRM, 272 quotes, 0 manual entries)
- Specialized agent architecture (CRM Agent + Product Agent, strict JSON)
- Python business tools (19 Tkinter scripts)
- Make automations (5 scenarios, 600+ executions)
- AI image generator (gpt-image-1, 176 refs, 21h saved)
- Carnetto SaaS, career path, quick summary, 90-day plan
- What didn't work (Feedcasse, Carnetto — honest narrative)

**Progressive UX**
- Word-by-word typing effect on responses
- Rotating thinking indicator ("Analysing...", "Formulating...", "Thinking...")
- Response time counter under each bubble
- Dynamic follow-up questions (never the same)
- Persistent nav that grows as panels are explored
- Dark / light mode, bilingual FR / EN
- Voice input (Web Speech API)
- Recruiter mode: detects if the visitor is hiring and adapts the pitch
- LinkedIn CTA after 4 exchanges

**Easter eggs**
- Hidden comment in source code with Konami hint
- Konami code (↑↑↓↓←→←→BA) → secret panel
- Dynamic tab title when window is in background

**Security**
- API key server-side only (Vercel env variable)
- System prompt in `prompts/system-prompt.txt` — read at runtime, never exposed client-side
- Rate limiting: 20 messages/hour per IP in each instance's memory. Redis is used for the counter, not for this limit. A shared production cost cap remains to be implemented.
- Systematic HTML escaping of user input and LLM output (anti-XSS)
- Strict payload validation (size, type, length per message)
- Explicit timeout on Anthropic call (15s)
- Neutral error messages client-side, details in server logs only
- Security headers via `vercel.json` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

---

## Deploy your own version

### 1. Clone the repo

```bash
git clone https://github.com/evangabrielmaillard-ai/portfolio-as-a-conversation.git
cd portfolio-as-a-conversation
```

### 2. Deploy on Vercel

Connect the GitHub repo to [vercel.com](https://vercel.com) — automatic deployment in 3 clicks.

### 3. Add the environment variable

In Vercel → Settings → Environment Variables:

```
ANTHROPIC_API_KEY = sk-ant-...
```

The system prompt is read from `prompts/system-prompt.txt` and enriched with `content/portfolio.js`. There is no duplicate fallback prompt. Context limits and per-request costs still apply. Prompt caching is not enabled by this change.

---

## Customizing

| Element | Where to edit |
|---------|--------------|
| Profile, achievements, panel triggers | `system-prompt.txt` |
| Panel content | `buildProjects()`, `buildCareer()`, etc. in `index.html` |
| Landing suggestions | `<button class="chip">` tags in `index.html` |
| Punchlines | `const TAGLINES` array in `index.html` |
| Follow-up questions | `FOLLOWUP_POOLS` object in `index.html` |

---

## Technical trade-offs & known limitations

**Why vanilla JS / single file**
Deliberate choice for a solo project. No build step, no dependencies, immediate deployment. Trade-off: the file grows with content (~100KB). Beyond that, separating CSS and JS would make sense.

**Why Vercel Serverless**
Zero infrastructure management. The `/api/chat` function is the only server component — it handles rate limiting, validation and the Anthropic proxy. Known limitation: rate limiting is in-memory per instance, not shared across instances (acceptable for a portfolio).

**Why `system-prompt.txt` in the repo**
Vercel limits environment variables to ~4KB in its web UI. The full system prompt (~9KB) exceeds that limit. Solution: the file is read at runtime by `api/chat.js` via `fs.readFileSync`. It's versioned with the code, editable like any other file, with no size limit.

**What was intentionally not industrialized**
- No database (unnecessary for this use case)
- No automated tests
- No advanced monitoring (Vercel Analytics is sufficient)
- FR/EN bilingual is a UX feature, not a distinct editorial architecture
- LLM response JSON parsing uses regex — reliable in the vast majority of cases, documented as a known limitation

**What I'd do in V2**
- Separate CSS and JS into dedicated files as the project grows further
- Stream responses for smoother UX

---

## License

MIT — free to reuse, adapt, fork.

---

*Built with [Claude](https://claude.ai) · Deployed on [Vercel](https://vercel.com)*
