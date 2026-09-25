/* Public case data shared by the UI and server. */
const PORTFOLIO_CASES = {
  "veille": {
    "title": {
      "fr": "Veille aides & subventions",
      "en": "Grants monitoring"
    },
    "problem": {
      "fr": "Repérer les aides pertinentes et les rapprocher des produits et des profils clients.",
      "en": "Identify relevant grants and match them to products and customer profiles."
    },
    "architecture": {
      "fr": "Sources institutionnelles → recherche documentaire et web → rapprochement catalogue → recommandations en JSON → validation humaine. Responses API, file_search et web_search structurent la recherche.",
      "en": "Institutional sources → document and web search → catalogue matching → JSON recommendations → human review. Responses API, file_search and web_search structure the research."
    },
    "results": {
      "fr": "Périmètre décrit : 35 sources, 378 organisations pseudonymisées et 488 références enrichies. Ces volumes décrivent la couverture, pas des ventes obtenues.",
      "en": "Reported scope: 35 sources, 378 pseudonymised organisations and 488 enriched product references. These counts describe coverage, not sales."
    },
    "limits": {
      "fr": "Une correspondance ne garantit pas l’éligibilité. Vérifier les conditions et les dates auprès de la source institutionnelle avant toute recommandation. Aucun taux de conversion documenté.",
      "en": "A match does not guarantee eligibility. Check conditions and dates against the institutional source before recommending. No documented conversion rate."
    },
    "lesson": {
      "fr": "Séparer collecte, rapprochement et validation pour rendre chaque recommandation vérifiable.",
      "en": "Separate collection, matching and review so each recommendation can be checked."
    },
    "decision": {
      "fr": "Produire une recommandation structurée, puis la faire valider. Un rapprochement entre une aide et un produit ne suffit pas à établir l’éligibilité.",
      "en": "Produce a structured recommendation, then have it reviewed. Matching a grant to a product is not enough to establish eligibility."
    },
    "discussion": {
      "fr": "Quelles sources méritent votre confiance, et qui valide la recommandation avant son utilisation ?",
      "en": "Which sources do you trust, and who reviews a recommendation before anyone acts on it?"
    },
    "steps": {
      "fr": [
        "Sources institutionnelles",
        "Recherche",
        "Rapprochement catalogue",
        "JSON",
        "Validation humaine"
      ],
      "en": [
        "Institutional sources",
        "Search",
        "Catalogue matching",
        "JSON",
        "Human review"
      ]
    }
  },
  "pipeline": {
    "title": {
      "fr": "Du devis PDF à Pipedrive",
      "en": "From PDF quote to Pipedrive"
    },
    "problem": {
      "fr": "Réduire la ressaisie des devis et préserver toutes les lignes produit dans le CRM.",
      "en": "Reduce manual quote entry while preserving every product line in the CRM."
    },
    "architecture": {
      "fr": "PDF → extraction IA → normalisation → itération des produits → agrégation → affaire Pipedrive. Make orchestre le traitement ; les demandes atypiques nécessitent une vérification humaine.",
      "en": "PDF → AI extraction → normalisation → product iteration → aggregation → Pipedrive deal. Make orchestrates processing; atypical requests require human review."
    },
    "results": {
      "fr": "Ordre de grandeur déclaré : environ 10 minutes de saisie ramenées à 10 secondes de traitement par devis. Ce temps technique ne comprend pas toute la validation humaine ; période et échantillon de mesure à préciser.",
      "en": "Reported order of magnitude: roughly 10 minutes of data entry reduced to 10 seconds of processing per quote. Processing time does not include all human review; measurement period and sample remain to be specified."
    },
    "limits": {
      "fr": "Incident : un module ne traitait qu’un produit. Correction par un itérateur avant agrégation. Autre cas rencontré : extensions .PDF en majuscules. La lecture reste dépendante de la qualité du document.",
      "en": "Incident: a module processed only one product. Fixed with an iterator before aggregation. Another edge case involved uppercase .PDF extensions. Extraction still depends on document quality."
    },
    "lesson": {
      "fr": "Tester les documents réels, les variantes de fichiers et les devis multi-produits avant de conclure à la fiabilité du flux.",
      "en": "Test real documents, filename variants and multi-product quotes before considering the flow reliable."
    },
    "decision": {
      "fr": "Préserver toutes les lignes produit : itérer avant d’agréger les données du devis. L’incident du produit unique a montré pourquoi cette étape compte.",
      "en": "Preserve every product line: iterate before aggregating the quote data. The single-product incident showed why this step matters."
    },
    "discussion": {
      "fr": "Comment vérifieriez-vous qu’aucune ligne n’a disparu entre le PDF et le CRM ? C’est un bon sujet pour examiner ce flux ensemble.",
      "en": "How would you check that no line disappeared between the PDF and the CRM? That is a useful starting point for reviewing this flow together."
    },
    "steps": {
      "fr": [
        "Devis PDF",
        "Extraction",
        "Itération des produits",
        "Agrégation",
        "Pipedrive"
      ],
      "en": [
        "PDF quote",
        "Extraction",
        "Product iteration",
        "Aggregation",
        "Pipedrive"
      ]
    }
  },
  "imagegen": {
    "title": {
      "fr": "Images produit en contexte",
      "en": "Product images in context"
    },
    "problem": {
      "fr": "Créer des mises en situation à partir de photos produit, avec un contrôle qualité explicite.",
      "en": "Create contextual images from product photos with explicit quality review."
    },
    "architecture": {
      "fr": "Photo sur fond blanc → gpt-image-1 → trois environnements → contrôle visuel → sélection ou rejet.",
      "en": "White-background photo → gpt-image-1 → three environments → visual review → selection or rejection."
    },
    "results": {
      "fr": "Lot décrit : 176 références × 3 environnements, soit 528 images générées. Environ 21 heures économisées pour environ 200 $ : estimations déclarées pour ce lot, pas un gain mensuel.",
      "en": "Reported batch: 176 references × 3 environments, or 528 generated images. About 21 hours saved for about $200: reported estimates for this batch, not monthly savings."
    },
    "limits": {
      "fr": "Environ une image sur six est rejetée. Les images générées ne sont donc pas toutes utilisables ; vérifier la fidélité au produit avant publication.",
      "en": "Roughly one image in six is rejected. Generated images are not all usable; check product fidelity before publication."
    },
    "lesson": {
      "fr": "Inclure le tri et les rejets dans l’évaluation du gain, plutôt que compter uniquement les images générées.",
      "en": "Include review and rejection in the savings estimate instead of counting only generated images."
    },
    "decision": {
      "fr": "Garder une étape de sélection : une image générée n’est pas automatiquement une image publiable. Compter les rejets pour évaluer le gain.",
      "en": "Keep a selection stage: a generated image is not automatically ready to publish. Include rejections when assessing savings."
    },
    "discussion": {
      "fr": "Quels défauts rendraient une image inutilisable pour votre catalogue, et combien de temps reste nécessaire pour la valider ?",
      "en": "What defects would make an image unusable in your catalogue, and how long does review still take?"
    },
    "steps": {
      "fr": [
        "Photo produit",
        "Génération × 3",
        "Contrôle visuel",
        "Sélection ou rejet"
      ],
      "en": [
        "Product photo",
        "Generation × 3",
        "Visual review",
        "Select or reject"
      ]
    }
  },
  "louche": {
    "title": {
      "fr": "Louche ou Pas : construire et exploiter",
      "en": "Louche ou Pas: build and operate"
    },
    "problem": {
      "fr": "Construire un service d’analyse de messages suspects et exploiter sa chaîne de contenu.",
      "en": "Build a suspicious-message analysis service and operate its content pipeline."
    },
    "architecture": {
      "fr": "Application React/TypeScript, Supabase et Stripe. Agent sur VPS conteneurisé, outils MCP et tâches planifiées pour la veille et la publication. Validation humaine sur les actions sensibles.",
      "en": "React/TypeScript application with Supabase and Stripe. Containerised VPS agent, MCP tools and scheduled monitoring and publishing tasks. Human approval for sensitive actions."
    },
    "results": {
      "fr": "Service et agent décrits comme déployés. Le cas démontre la construction et l’exploitation ; aucun volume d’utilisateurs ni taux de détection validé n’est fourni.",
      "en": "Service and agent are reported as deployed. This case demonstrates building and operations; no user volume or validated detection rate is provided."
    },
    "limits": {
      "fr": "Un incident d’écrasement de contenu a conduit à corriger l’outil, restaurer le contenu et privilégier des ajouts non destructifs. L’analyse d’un message ne garantit pas l’absence d’arnaque.",
      "en": "A content overwrite incident led to a tool fix, content restoration and a preference for non-destructive additions. Message analysis cannot guarantee the absence of a scam."
    },
    "lesson": {
      "fr": "Le fonctionnement en production exige des droits limités, des opérations réversibles et une supervision humaine.",
      "en": "Production operation requires limited permissions, reversible operations and human oversight."
    },
    "decision": {
      "fr": "Après un écrasement de contenu, privilégier les ajouts non destructifs et la validation humaine des opérations sensibles.",
      "en": "After a content overwrite, favour non-destructive additions and human approval for sensitive operations."
    },
    "discussion": {
      "fr": "Quelles actions laisser à l’agent, lesquelles soumettre à validation, et comment revenir en arrière en cas d’erreur ?",
      "en": "Which actions should the agent take, which should need approval, and how can a mistake be reversed?"
    },
    "steps": {
      "fr": [
        "Veille",
        "Agent",
        "Outils MCP",
        "Publication",
        "Supervision"
      ],
      "en": [
        "Monitoring",
        "Agent",
        "MCP tools",
        "Publishing",
        "Oversight"
      ]
    }
  },
  "orders": {
    "title": {
      "fr": "De la boîte mail au devis client",
      "en": "From the shared inbox to the customer quote"
    },
    "problem": {
      "fr": "Traiter les commandes reçues sur une boîte mail générale et les faire avancer jusqu’au devis envoyé au client.",
      "en": "Process orders received in a shared inbox and take them through to a quote sent to the customer."
    },
    "contribution": {
      "fr": "J’ai mis en place un flux orchestré avec Make, dont l’intégration des commandes au CRM fonctionne sans intervention humaine. C’est une réalisation dont je suis particulièrement fier.",
      "en": "I put in place a Make-orchestrated workflow whose order integration into the CRM runs without manual intervention. It is a project I am particularly proud of."
    },
    "decision": {
      "fr": "Répartir les demandes selon le secteur et distinguer les produits standard des produits spéciaux, qui nécessitent un ajustement, avant de produire le devis.",
      "en": "Route requests by sector and distinguish standard products from special products, which require an adjustment, before producing the quote."
    },
    "architecture": {
      "fr": "Boîte mail générale → répartition par secteur → intégration au CRM → distinction produit standard / produit spécial et ajustement si nécessaire → devis produit dans le CRM avec un modèle intégré → renvoi au client. Make orchestre cette chaîne.",
      "en": "Shared inbox → routing by sector → CRM integration → standard/special product distinction and adjustment if needed → quote created in the CRM using an integrated template → sent back to the customer. Make orchestrates this chain."
    },
    "results": {
      "fr": "Un flux relié de la réception au renvoi du devis. L’intégration au CRM est réalisée sans intervention humaine. Aucun volume ni gain de temps n’est ajouté aux éléments confirmés.",
      "en": "A connected flow from receipt to sending the quote. CRM integration runs without manual intervention. No volume or time-saving figure is added beyond the confirmed information."
    },
    "limits": {
      "fr": "Les règles d’ajustement des produits spéciaux et le traitement d’une demande impossible à intégrer restent à préciser. Le détail des étapes faisant appel à un modèle d’IA n’est pas documenté ici.",
      "en": "The adjustment rules for special products and handling of requests that cannot be integrated remain to be specified. The exact stages that call an AI model are not documented here."
    },
    "lesson": {
      "fr": "L’intérêt du système est la continuité entre les étapes : recevoir, orienter, intégrer et préparer une réponse client dans le même flux métier.",
      "en": "The value lies in continuity across steps: receive, route, integrate and prepare a customer response within one business workflow."
    },
    "discussion": {
      "fr": "Nous pouvons échanger sur la répartition par secteur, la distinction standard/spécial et la génération du devis dans le CRM.",
      "en": "We can discuss routing by sector, standard versus special products and quote generation in the CRM."
    },
    "steps": {
      "fr": [
        "Boîte mail générale",
        "Répartition par secteur",
        "CRM",
        "Standard / spécial",
        "Devis sur modèle",
        "Envoi client"
      ],
      "en": [
        "Shared inbox",
        "Sector routing",
        "CRM",
        "Standard / special",
        "Template-based quote",
        "Customer delivery"
      ]
    }
  }
};
if (typeof module !== "undefined") module.exports = PORTFOLIO_CASES;
