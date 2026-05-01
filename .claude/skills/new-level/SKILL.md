---
name: new-level
description: Guide interactif pour appliquer une montée de niveau D&D 5e — HP, capacités, sorts, manifestations occultes, améliorations de caractéristiques.
disable-model-invocation: false
allowed-tools: Read Glob Grep
---

Guide Korven pour monter d'un niveau. Arguments optionnels : `$ARGUMENTS` (ex: "niveau 3" pour cibler un niveau précis).

## Étapes de la montée de niveau

### 1. Détecter le niveau actuel
Demande ou déduis le niveau actuel depuis le contexte de la conversation.
Niveau cible = niveau actuel + 1 (sauf si précisé dans les arguments).

### 2. Points de vie
- Occultiste : dé de vie d8
- Options : lancer 1d8 ou prendre la valeur fixe (5)
- Ajouter le modificateur de Constitution
- Demander à l'utilisateur s'il veut lancer le dé ou prendre la valeur fixe

### 3. Nouvelles capacités de classe
Consulte `CLASS_FEATURES['occultiste']` dans `public/app.js` et `CLASS_FEATURES_TYPED['occultiste']` pour lister :
- Les capacités automatiques gagnées à ce niveau
- Les choix à faire (nouvelles manifestations occultes, etc.)
- Les améliorations de caractéristiques (niveaux 4, 8, 12, 16, 19)

### 4. Sorts
Consulte `data/class-progression.json` pour l'occultiste au nouveau niveau :
- Nouveaux sorts mineurs connus (si applicable)
- Nouveaux sorts connus
- Nouveaux emplacements de sort (niveau des emplacements)
- Sorts de pacte étendu (si patron choisi)

### 5. Manifestations occultes
Si le niveau augmente le nombre de manifestations (voir `countByLevel` dans CLASS_FEATURES_TYPED) :
- Indiquer combien de nouvelles manifestations peuvent être choisies
- Lister les options disponibles avec leurs descriptions

### 6. Récapitulatif
Affiche un résumé complet de tous les changements à appliquer, formaté clairement :

```
## Montée au niveau X

**Points de vie** : +Y (à confirmer)

**Nouvelles capacités**
- [liste]

**Sorts**
- Sorts connus : N → N+1
- Niveau des emplacements : N

**Manifestations occultes**
- +1 manifestation à choisir (total : N)

**À faire dans l'application**
1. Mettre à jour le niveau dans Profil
2. Ouvrir "Modifier les choix" pour sélectionner la nouvelle manifestation
3. Apprendre le nouveau sort dans l'onglet Magie
```

Reste disponible pour répondre aux questions sur les choix à faire.
