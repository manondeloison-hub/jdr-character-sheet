---
name: validate-character
description: Valide la cohérence de la fiche de personnage D&D 5e — bonus de maîtrise, emplacements de sorts, capacités de classe, scores de caractéristiques.
disable-model-invocation: false
allowed-tools: Bash Read Glob
---

Valide la fiche de personnage Korven contre les règles D&D 5e.

Les données du personnage sont stockées dans Upstash Redis et accessibles via l'API du serveur. Pour les lire localement, utilise `public/app.js` comme référence des formules et `data/class-progression.json` pour la progression de classe.

## Vérifications à effectuer

### Scores de caractéristiques
- Chaque score de base doit être entre 3 et 18
- Les modificateurs doivent correspondre à `floor((score - 10) / 2)`
- Les bonus raciaux doivent correspondre à la race (voir `RACIAL_BONUSES` dans app.js)

### Bonus de maîtrise
- Niv. 1-4 → +2 | Niv. 5-8 → +3 | Niv. 9-12 → +4 | Niv. 13-16 → +5 | Niv. 17-20 → +6

### Jets de sauvegarde
- Les 2 sauvegardes de maîtrise de l'occultiste sont : Sagesse et Charisme
- Valeur = modificateur de caractéristique + bonus de maîtrise (si maîtrisé)

### Emplacements de sorts (Occultiste)
- Niv. 1 : 1 emplacement | Niv. 2 : 2 | Niv. 3-4 : 2 (niveau 2) | Niv. 5-6 : 3 (niveau 3) | etc.
- Les sorts du pacte se récupèrent sur repos court, pas long

### Capacités de classe
- Lire `CLASS_FEATURES['occultiste']` dans app.js
- Vérifier que les capacités affichées correspondent bien au niveau actuel

### Manifestations occultes
- Compter le nombre de manifestations selon le niveau (voir `countByLevel` dans CLASS_FEATURES_TYPED)
- Vérifier que les manifestations choisies existent dans la liste

## Sortie
Rapport structuré avec ✅ (OK) / ⚠️ (avertissement) / ❌ (erreur) pour chaque point.
Si des incohérences sont trouvées, proposer la correction exacte.
