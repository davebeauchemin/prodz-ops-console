# Rapport CRM — Analyse & Recommandations

**Date :** 14 mars 2026
**CRM utilisé :** GoHighLevel (GHL)
**Destinataire :** CEO

---

## Contexte

L'équipe opère actuellement sur **2 pipelines GoHighLevel** :

**Pipeline Ventes NEW**

| # | Stage | Responsable | Statut GHL |
|---|---|---|---|
| 1 | LEAD - New leads ads | Setter | Ouvert |
| 2 | LEAD - New lead site | Setter | Ouvert |
| 3 | LEADS - Référencement | Setter | Ouvert |
| 4 | LEAD - Pipeline de qualification | Setter | Ouvert |
| 5 | N.A #1 / N.A #2 / N.A Dead | Setter / Closer | Ouvert |
| 6 | Appel PROSPECTION - Printemps | Setter | Ouvert |
| 7 | Appel PROSPECTION | Setter | Ouvert |
| 8 | Appel CONSULTATION | Closer | Ouvert |
| 9 | Offre Déposée - Attente de finalisation | Closer | Ouvert |
| 10 | Appel FINALISATION | Closer | Ouvert |
| 11 | Appel FINALISATION - Printemps | Closer | Ouvert |

**Pipeline de qualification**

| # | Stage | Responsable | Statut GHL |
|---|---|---|---|
| 1 | Formulaire Soumis | Non défini / Directeur | Ouvert |
| 2 | Qualification complète | Non défini / Directeur | Ouvert |
| 3 | Nurture Track | Non défini / Directeur | Ouvert / Abandonné |
| 4 | Appel de prospection | Non défini / Directeur | Ouvert |
| 5 | Appel de vente | Non défini / Directeur | Ouvert |
| 6 | Vente urgente | Non défini / Directeur | Ouvert |
| 7 | Signé avec une autre agence | Non défini / Directeur | Perdu |

---

## Fonctionnement actuel

Le flux ci-dessous décrit comment un lead est traité aujourd'hui dans GHL, étape par étape.

**1. Entrée du lead**
Un nouveau lead entre via Meta Ads ou le site web. Une opportunité est automatiquement créée dans le **Pipeline Ventes NEW** au stage correspondant (`LEAD - New leads ads` ou `LEAD - New lead site`).

**2. Premier contact — Setter**
Le setter tente de joindre le prospect. Si aucune réponse, le deal est déplacé en `N.A #1`. Aucune tâche de suivi n'est créée : l'équipe se fie uniquement au visuel du pipeline pour rappeler/follow-up, ce qui est insuffisant.

**3. Qualification selon la réponse du lead**


| Outcome                           | Action                                     | Destination                                             |
| --------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| Lead disqualifié                  | Déplacé en Nurture Track                   | Statut laissé à "ouvert" *(devrait être DQ ou Abandon)* |
| Lead qualifié                     | Appel de consultation booké                | `Appel CONSULTATION` → transfert au closer              |
| Pas disponible pour un appel live | Appel de prospection planifié              | Reste dans les mains du setter                          |
| Veut être recontacté plus tard    | Déplacé en `Appel PROSPECTION - Printemps` | Stage peu structuré, difficilement gérable              |


**4. Traitement par le closer**

- **No-show :** Le lead reçoit rarement un suivi dans les 24h. Il reste bloqué au stage `Appel CONSULTATION` pendant plus de 30 jours sans action.
- **Lead qualifié :** Déplacé à `Offre Déposée - Attente de finalisation`. Aucune tâche n'est créée — le directeur ou le closer ajoute manuellement une ligne dans un fichier Excel pour tracker les follow-ups.
- **Réponse tardive du lead :** Le deal tombe dans `Finalisation - PRINTEMPS` et en ressort rarement.

---

## Problèmes identifiés

### 1. Absence de structure de travail standardisée

Aucun processus clair ne définit comment chaque membre de l'équipe doit traiter un lead (module de tâches, pipeline, conversations). Chaque membre opère selon sa propre méthode, ce qui crée des incohérences et des angles morts.

### 2. Notes post-consultation inexistantes dans le CRM

Les informations recueillies lors des consultations sont consignées dans un fichier Excel externe plutôt que directement dans GHL. Cette pratique fragmente les données et rend impossible une vue unifiée du pipeline.

### 3. Duplication des données et risque d'erreur élevé

La gestion en parallèle GHL + Excel génère des doublons, des désalignements entre membres de l'équipe et une perte de temps significative pour maintenir la cohérence des données.

### 4. Daily Huddle inefficaces

Une portion importante des réunions matinales (non rémunérées) est consacrée à aligner le directeur et les closers sur l'état de chaque prospect — une information qui devrait être accessible en temps réel dans GHL sans nécessiter d'échange verbal.

### 5. Aucun suivi automatisé pour les no-shows

Lorsqu'un prospect ne se présente pas à un appel de consultation, aucun courriel, SMS ou appel de relance n'est déclenché dans les 24 heures. Ces prospects restent bloqués au stage **Appel CONSULTATION** avec le tag `point mort` (inactifs depuis plus de 30 jours).

### 6. Système de tâches non exploité

Aucune tâche de suivi n'est créée après les interactions. Sans adoption du module de tâches par l'équipe, l'automatisation de cette étape n'aurait aucun impact.

### 7. Deals closés non tracés

Les ventes conclues ne sont consignées nulle part, à l'exception d'un fichier Excel accessible uniquement au directeur. Depuis plus de 2 mois, il est impossible de savoir qui a closé quoi sans passer par lui directement.

### 8. Relances SMS non stratégiques — risque de réputation

Certains leads ont reçu 2 à 3 SMS en l'espace de 3 semaines sans qu'aucune réponse n'ait été obtenue entre les envois. Cette cadence excessive génère des plaintes directes de prospects qui demandent à ne plus être contactés. En l'absence de règles de fréquence et de délais définis, les relances automatiques ou manuelles sont envoyées sans cohérence, ce qui nuit à la réputation de l'entreprise et grille des leads potentiellement récupérables.

### 9. Rapport EOD peu fiable

Le rapport de fin de journée est complété manuellement par chaque setter/closer. Le manque de structure rend les données invérifiables et difficilement exploitables sur le long terme.

---

## Solutions proposées

### 1. Restructurer les pipelines et les stages

Revoir l'architecture des pipelines pour qu'elle reflète fidèlement le flux réel de traitement des leads, avec des stages aux noms clairs et mutuellement exclusifs.

### 2. Implémenter le module de tâches de façon systématique

Former l'équipe à créer des tâches de suivi après chaque interaction. Sans cette adoption, aucune automatisation ne pourra fonctionner efficacement.

### 3. Définir un flow d'exécution quotidien clair

**Pour les setters :**

1. Traiter les nouvelles demandes entrantes en priorité
2. Vérifier les conversations pour identifier les nouvelles demandes
3. Exécuter les tâches restantes via le module Contacts/Tasks
4. Passer en mode veille sur les conversations et les nouvelles entrées dans le pipeline

**Pour les closers :**

1. Vérifier le calendrier des appels de consultation du jour
2. En dehors des appels, exécuter les tâches (relances no-show, suivis d'offres, etc.)
3. Une fois les tâches complétées, préparer les dossiers pour les prochains RDV ou apporter du support aux setters

### 4. Automatiser les suivis no-show et offres déposées

Mettre en place des séquences automatiques (email, SMS, tâche assignée) déclenchées dès qu'un prospect ne se présente pas ou qu'une offre reste sans réponse. Ceci réduit la communication interne nécessaire et limite les leads perdus par inaction.

### 5. Synchroniser les deals closés avec Monday.com

Dès qu'un deal est closé dans GHL, les informations de base (contact, montant, closer responsable) doivent être automatiquement envoyées dans Monday.com — éliminant le fichier Excel et permettant au chargé de projet de démarrer son processus sans intervention manuelle.

### 6. Automatiser le rapport EOD via les actions dans GHL

Lorsqu'un setter/closer complète une action avec un lead (appel, relance, offre), une case à cocher dans GHL déclenche automatiquement l'envoi des données vers le rapport du directeur (GoVente). En fin de journée, le membre de l'équipe copie-colle ses métriques générées automatiquement dans le fichier EOD — sans saisie manuelle.

**En-têtes GoVente à remplir :** `Dials | Picked-up | Call booked | Rappel moi | DQ | FUP | Showed call | Close`

---

## Conclusion

Les problèmes identifiés ont un impact direct sur la vélocité des ventes, la fiabilité des données et la charge opérationnelle de l'équipe. La majorité des inefficacités proviennent d'un manque d'adoption des outils existants dans GHL combiné à l'absence d'automatisations de base.

Les solutions proposées ne nécessitent pas d'investissement en nouveaux outils — elles reposent sur une meilleure utilisation de l'infrastructure déjà en place, couplée à des automations ciblées.

> **Priorité recommandée :** Restructuration des pipelines → Formation aux tâches → Automatisation no-show → Sync Monday.com → Automatisation EOD

