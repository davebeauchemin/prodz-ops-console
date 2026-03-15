# Plan d'action CRM — GoHighLevel

**Date :** 14 mars 2026
**Objectif :** Restructurer le flow d'exécution, les pipelines et les processus de suivi pour maximiser la conversion et éliminer les pertes de leads.

---

## Table des matières

1. [Nouvelle structure des pipelines](#1-nouvelle-structure-des-pipelines)
2. [Flow d'exécution quotidien](#2-flow-dexécution-quotidien)
3. [Cases à cocher par action de lead](#3-cases-à-cocher-par-action-de-lead)
4. [Automatisations à mettre en place](#4-automatisations-à-mettre-en-place)
5. [Intégrations externes](#5-intégrations-externes)
6. [Plan de déploiement](#6-plan-de-déploiement)

---

## 1. Nouvelle structure des pipelines

### Principe directeur
Deux pipelines distincts avec des responsables clairs : **le setter gère la qualification**, **le closer gère la conversion**. Chaque stage a un seul outcome possible et un responsable identifié.

---

### Pipeline 1 — Prospection & Qualification *(Setter)*

| # | Stage | Responsable | Statut GHL |
|---|---|---|---|
| 1 | 🟢 Nouveau Lead — Ads | Setter | Ouvert |
| 2 | 🟢 Nouveau Lead — Site | Setter | Ouvert |
| 3 | 📞 Tentative de contact #1 | Setter | Ouvert |
| 4 | 📞 Tentative de contact #2 | Setter | Ouvert |
| 5 | 📞 Tentative de contact #3 | Setter | Ouvert |
| 6 | ☎️ Appel de prospection planifié | Setter | Ouvert |
| 7 | 🔄 Nurture — Recontact futur | Setter | Ouvert |
| 8 | ✅ Transféré — Appel consultation | Closer | Ouvert |
| 9 | ❌ N.A. Dead | — | Abandonné |
| 10 | ❌ Disqualifié | — | Perdu |

> **Règle :** Après 3 tentatives sans réponse → `N.A. Dead` (statut : Abandonné). Le lead peut réintégrer le pipeline si recontact entrant.

---

### Pipeline 2 — Vente & Closing *(Closer)*

| # | Stage | Responsable | Statut GHL |
|---|---|---|---|
| 1 | 🗓️ Consultation planifiée | Closer | Ouvert |
| 2 | ⚠️ No-Show — Suivi requis | Closer / Setter | Ouvert |
| 3 | 💼 Offre déposée — En attente | Closer | Ouvert |
| 4 | 📋 Appel de finalisation | Closer | Ouvert |
| 5 | ✅ Deal Closé — Sync Monday | — | Gagné |
| 6 | ❌ Perdu — Signé ailleurs | — | Perdu |
| 7 | 🔄 Nurture long terme | Setter | Ouvert |

> **Règle :** Tout lead en `No-Show` doit recevoir une tâche de suivi dans les 2h suivant le no-show, assignée au closer ou au setter désigné.

---

## 2. Flow d'exécution quotidien

### Setter — Routine journalière

```
Début de journée
│
├── 1. Ouvrir Pipeline 1 → Trier par stage "Nouveau Lead"
│       → Contacter chaque nouveau lead en priorité
│       → Mettre à jour le stage + cocher les actions (voir section 3)
│
├── 2. Vérifier le module Conversations
│       → Répondre aux messages entrants
│       → Si nouveau lead identifié → créer opportunité + assigner stage
│
├── 3. Exécuter les tâches via Contacts / Tasks
│       → Relances planifiées (FUP, Nurture, rappels)
│       → Cocher chaque action complétée
│
├── 4. Mode veille (continu)
│       → Surveiller les nouvelles conversations entrantes
│       → Surveiller les nouvelles opportunités dans le pipeline
│
└── 5. En fin de journée
        → Vérifier les leads sans activité depuis 24h (tâches en retard)
        → Copier-coller les métriques auto-générées dans le rapport EOD GoVente
```

---

### Closer — Routine journalière

```
Début de journée
│
├── 1. Vérifier le calendrier
│       → Identifier tous les appels de consultation du jour
│       → Préparer les dossiers prospects (notes GHL, historique)
│
├── 2. Entre les appels → Exécuter les tâches (Contacts / Tasks)
│       → Relances no-show
│       → Suivi sur offres déposées
│       → Appels de finalisation en attente
│       → Cocher chaque action complétée
│
└── 3. En fin de journée
        → Vérifier les leads en "Offre déposée" sans activité depuis 48h
        → Préparer les dossiers pour les consultations du lendemain
        → Copier-coller les métriques auto-générées dans le rapport EOD
```

---

## 3. Cases à cocher par action de lead

Ces cases sont à compléter dans GHL (champ personnalisé ou note structurée) **à chaque interaction avec un lead**. Elles alimentent automatiquement le rapport EOD.

---

### Setter — Checklist d'action par lead

```
Contact: [Nom du prospect] — [Date]

Actions effectuées:
[ ] Dial effectué                  → incrémente: Dials
[ ] Prospect a répondu             → incrémente: Picked-up
[ ] Appel de consultation booké    → incrémente: Call booked
[ ] Rappel demandé (recontact)     → incrémente: Rappel moi
[ ] Lead disqualifié (DQ)          → incrémente: DQ
[ ] Follow-up requis (FUP)         → incrémente: FUP

Stage après action:
[ ] Déplacé → Tentative #2 / #3
[ ] Déplacé → Appel prospection planifié
[ ] Déplacé → Transféré consultation
[ ] Déplacé → Nurture
[ ] Déplacé → N.A. Dead
[ ] Déplacé → Disqualifié

Tâche créée:
[ ] Tâche de suivi ajoutée (date + responsable)
[ ] Note ajoutée dans GHL
```

---

### Closer — Checklist d'action par lead

```
Contact: [Nom du prospect] — [Date]

Actions effectuées:
[ ] Appel booké                    → incrémente: Booked
[ ] Appel annulé par le prospect   → incrémente: Cancel
[ ] No-show (prospect absent)      → incrémente: No-show
[ ] Lead disqualifié               → incrémente: DQ
[ ] Follow-up effectué             → incrémente: Follow-up
[ ] Offre de service déposée       → incrémente: Offre déposée
[ ] Deal closé                     → incrémente: Closed
[ ] Paiement collecté              → incrémente: Cash Collected

Stage après action:
[ ] Déplacé → No-Show — Suivi requis
[ ] Déplacé → Offre déposée — En attente
[ ] Déplacé → Appel de finalisation
[ ] Déplacé → Deal Closé ✅
[ ] Déplacé → Perdu ❌
[ ] Déplacé → Nurture long terme

Tâche créée:
[ ] Tâche de suivi ajoutée (date + responsable)
[ ] Note post-consultation ajoutée dans GHL
[ ] Sync Monday.com déclenchée (si Deal Closé)
```

---

### Rapport EOD — Métriques auto-générées

**Setter** — À copier-coller dans le fichier GoVente :

| Dials | Picked-up | Call booked | Rappel moi | DQ | FUP | Showed call | Close |
|---|---|---|---|---|---|---|---|
| *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* |

**Closer** — À copier-coller dans le fichier GoVente :

| Booked | Cancel | No-show | DQ | Follow-up | Offre déposée | Closed | Cash Collected |
|---|---|---|---|---|---|---|---|
| *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* | *(auto)* |

---

## 4. Automatisations à mettre en place

### A. No-Show — Séquence de relance automatique

**Déclencheur :** Lead déplacé dans `No-Show — Suivi requis`

```
+0h   → SMS automatique : "Bonjour [Prénom], nous avons remarqué que vous n'avez pas pu
         vous présenter à notre appel. Souhaitez-vous replanifier ?"
+2h   → Tâche créée dans GHL : "Appel de relance no-show" → assignée au closer
+24h  → Email de relance automatique si aucune réponse
+72h  → Si toujours aucune réponse → déplacé en "Nurture long terme"
```

---

### B. Offre déposée — Séquence de suivi

**Déclencheur :** Lead déplacé dans `Offre déposée — En attente`

```
+24h  → Tâche créée : "Suivi offre déposée" → assignée au closer
+48h  → SMS automatique si aucune interaction
+5j   → Email de relance si toujours ouvert
+14j  → Alerte manuelle au directeur si deal toujours sans réponse
```

---

### C. Nurture — Recontact automatisé

**Déclencheur :** Lead déplacé dans `Nurture — Recontact futur`

```
+7j   → Email de valeur (contenu éducatif / cas client)
+21j  → Email de relance légère
+45j  → SMS de réengagement
+90j  → Tâche créée : "Décision Nurture" → conserver ou fermer le lead
```

---

### D. N.A. Dead — Réactivation

**Déclencheur :** Lead déplacé dans `N.A. Dead`

```
+3j   → SMS automatique : "Bonjour [Prénom], nous essayons de vous joindre depuis quelques
         jours. Êtes-vous toujours intéressé par nos services ?"
+7j   → Si toujours aucune réponse → statut final : Abandonné
```

---

### E. Relances SMS — Règles de fréquence et opt-out

**Problème :** Des leads ont reçu 2-3 SMS en 3 semaines sans réponse intermédiaire, générant des plaintes de harcèlement et des leads grillés inutilement.

**Règles de fréquence à configurer dans GHL :**

```
RÈGLE 1 — Délai minimum entre deux SMS : 7 jours
  → Aucun SMS ne peut être envoyé à un même contact à moins de 7 jours du précédent,
    peu importe la séquence déclencheuse.

RÈGLE 2 — Maximum de contacts SMS par séquence : 2 SMS
  → Si aucune réponse après 2 SMS → basculer sur email uniquement.
  → Si toujours aucune réponse → tâche manuelle assignée au setter/closer.

RÈGLE 3 — Opt-out automatique
  → Si le prospect répond "STOP", "Arrêtez", "Ne me contactez plus" ou équivalent
    → Tag automatique : `OPT-OUT`
    → Toutes les séquences actives sur ce contact sont annulées immédiatement
    → Statut du deal → Abandonné
    → Aucune relance possible sans intervention manuelle du directeur

RÈGLE 4 — Vérification avant envoi
  → Avant chaque envoi SMS automatique, GHL vérifie :
    - Le contact ne porte pas le tag `OPT-OUT`
    - Le dernier SMS date de plus de 7 jours
    - Le nombre de SMS envoyés dans la séquence est ≤ 2
```

**À ajouter au plan de déploiement :** Configurer ces règles comme conditions de garde dans chaque workflow GHL avant la mise en production des automatisations.

---

## 5. Intégrations externes

### Monday.com — Sync automatique à la fermeture d'un deal

**Déclencheur :** Lead déplacé dans `Deal Closé ✅` dans GHL

**Données envoyées automatiquement :**

| Champ Monday.com | Source GHL |
|---|---|
| Nom du client | Contact Name |
| Closer responsable | Assigned User |
| Date de closing | Date de déplacement du stage |
| Valeur du deal | Opportunity Value |
| Service vendu | Custom Field : Produit/Service |
| Prochaine étape | Custom Field : Note onboarding |

> Aucun fichier Excel. Le chargé de projet voit le nouveau deal apparaître automatiquement dans Monday.com avec toutes les informations nécessaires pour démarrer l'onboarding.

---

## 6. Plan de déploiement

### Phase 1 — Restructuration *(Semaine 1)*
- [ ] Archiver les anciens pipelines dans GHL
- [ ] Créer les 2 nouveaux pipelines avec les stages définis
- [ ] Configurer les champs personnalisés pour les checklists
- [ ] Former l'équipe sur la nouvelle structure (30 min)

### Phase 2 — Adoption des tâches *(Semaine 1-2)*
- [ ] Former chaque setter/closer sur le module Tasks
- [ ] Valider que chaque interaction génère une tâche de suivi
- [ ] Vérifier le respect du flow quotidien pendant 5 jours consécutifs

### Phase 3 — Automatisations *(Semaine 2-3)*
- [ ] Configurer la séquence No-Show
- [ ] Configurer la séquence Offre déposée
- [ ] Configurer la séquence Nurture
- [ ] Configurer la séquence N.A. Dead
- [ ] Tester chaque workflow avec un lead fictif

### Phase 4 — Intégrations *(Semaine 3-4)*
- [ ] Configurer le webhook GHL → Monday.com pour les deals closés
- [ ] Valider la sync avec un deal test
- [ ] Configurer la génération automatique des métriques EOD
- [ ] Valider le rapport EOD avec l'équipe pendant 3 jours

### Phase 5 — Suivi & ajustements *(Semaine 4+)*
- [ ] Review hebdomadaire des leads `point mort` (> 14 jours sans activité)
- [ ] Ajuster les délais des automatisations selon les résultats
- [ ] Éliminer le fichier Excel de suivi des deals
- [ ] Réduire la durée des Daily Huddle à < 10 min (alignement uniquement, pas de statut)
