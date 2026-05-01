# Instructions permanentes — JDR Character Sheet

## Projet
Application web D&D 5e pour gérer la fiche de Korven (Humain Occultiste).
Stack : Node.js / Express, Upstash Redis, HTML/CSS/JS vanilla, hébergé sur Render.

## Règles automatiques

### Avant chaque git commit
Toujours vérifier :
1. Le numéro de version dans `public/index.html` (id="build-number") est incrémenté par rapport au commit précédent
2. Aucun `console.log` ou `debugger` traîne dans les fichiers modifiés
3. Aucun TODO oublié dans les fichiers modifiés

Ne jamais committer sans avoir fait ces vérifications. Si l'une échoue, corriger avant de committer.

### Quand on cherche des données D&D 5e
Utiliser automatiquement le subagent `dnd-spell-researcher` pour récupérer des sorts, capacités ou règles sur aidedd.org. Ne pas chercher ces données manuellement.

### Quand on parle de montée de niveau
Suivre automatiquement le guide `/new-level` : HP, nouvelles capacités, sorts, manifestations occultes — ne rien oublier.

### Quand on modifie la logique de la fiche
Après un changement significatif touchant les calculs (modificateurs, jets de sauvegarde, emplacements de sorts), proposer de valider la cohérence des règles D&D 5e.

## Conventions du projet
- Incrémenter le numéro de version dans `index.html` à chaque commit, sans exception
- Pas de frameworks JS, pas de base de données relationnelle
- Toujours pousser après avoir commité (`git push origin main`)
