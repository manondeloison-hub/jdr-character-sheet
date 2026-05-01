---
name: pre-commit
description: Vérifie que tout est en ordre avant de committer — version incrémentée, JS syntaxiquement valide, aucun TODO oublié, cohérence des fichiers modifiés.
disable-model-invocation: false
allowed-tools: Bash Glob Grep Read
---

Effectue les vérifications suivantes avant de valider un commit sur ce projet.

## 1. Numéro de version
- Lis le numéro de version actuel dans `public/index.html` (cherche `id="build-number"`)
- Compare avec le dernier commit git (`git log -1 --format="%s"`)
- Vérifie que le numéro dans index.html est bien supérieur à celui du commit précédent
- Si la version n'a pas été incrémentée : BLOQUER et demander de corriger

## 2. Cohérence des fichiers modifiés
- Récupère la liste des fichiers modifiés (`git diff --name-only` et `git diff --cached --name-only`)
- Si `app.js` est modifié mais pas `index.html` : vérifier que la version n'aurait pas dû être incrémentée
- Si `style.css` est modifié : vérifier qu'aucune classe CSS n'est référencée dans le JS sans être définie dans le CSS

## 3. Balises HTML
- Dans `public/index.html`, vérifier qu'il n'y a pas de balises ouvertes non fermées évidentes

## 4. TODOs et marqueurs temporaires
- Chercher dans les fichiers modifiés : `TODO`, `FIXME`, `HACK`, `console.log`, `debugger`
- Signaler chaque occurrence avec le fichier et la ligne

## 5. Résumé
Affiche un résumé ✅/⚠️/❌ pour chaque vérification, puis donne une conclusion : **safe to commit** ou **corrections nécessaires**.
