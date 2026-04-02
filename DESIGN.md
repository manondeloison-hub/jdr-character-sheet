# JDR — Fiche de personnage D&D 5e

## Objectif

Site web personnel pour afficher et gérer une fiche de personnage Donjons & Dragons 5e complète, avec gestion de la montée de niveau et des sorts.

## Pour qui

- Usage personnel uniquement
- Un seul personnage pour le moment

## Stack technique

- **Serveur :** Node.js / Express
- **Stockage perso :** Upstash Redis
- **Données sorts/progression :** Fichiers JSON embarqués dans le repo
- **Front-end :** HTML / CSS / JS vanilla
- **Hébergement :** Render
- **Code :** GitHub (manondeloison-hub)

## Architecture

```
jdr/
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── data/
│   ├── spells.json
│   └── class-progression.json
├── package.json
└── render.yaml
```

### API REST

- `GET /api/character` — récupère le perso depuis Upstash
- `PUT /api/character` — sauvegarde le perso dans Upstash
- `GET /api/spells?class=X&maxLevel=Y` — sorts disponibles filtrés
- `POST /api/login` — authentification par mot de passe

## Structure des données du personnage

```json
{
  "name": "Nom du perso",
  "race": "Elfe",
  "class": "Magicien",
  "level": 5,
  "xp": 6500,
  "stats": {
    "strength": 8, "dexterity": 14, "constitution": 12,
    "intelligence": 18, "wisdom": 13, "charisma": 10
  },
  "hp": { "max": 32, "current": 28 },
  "armorClass": 12,
  "speed": 30,
  "proficiencyBonus": 3,
  "savingThrows": ["intelligence", "wisdom"],
  "skills": { "arcana": true, "history": true },
  "equipment": ["Baton", "Grimoire"],
  "traits": ["Vision dans le noir", "Transe"],
  "classFeatures": ["Restauration arcanique", "Ecole d'evocation"],
  "knownSpells": ["boule-de-feu", "bouclier"],
  "preparedSpells": ["boule-de-feu"],
  "spellSlots": { "1": 4, "2": 3, "3": 2 }
}
```

## Interface utilisateur

### En-tete permanent

Nom, race, classe, niveau, XP, PV — toujours visible. Bouton "Monter de niveau".

### Onglets

1. **Profil** — Stats (6 caracteristiques + modificateurs), jets de sauvegarde, competences
2. **Combat** — CA, initiative, vitesse, PV detailles, equipement/armes
3. **Sorts** — Emplacements, sorts prepares/connus, fiches detaillees au clic
4. **Capacites** — Traits raciaux, capacites de classe
5. **Inventaire** — Equipement, objets, or

Responsive : onglets swipeable / selecteur sur mobile.

## Montee de niveau

1. **Confirmation** — "Passer au niveau X ?" avec recap des changements
2. **Mises a jour automatiques** — Bonus de maitrise, emplacements de sorts, de de vie
3. **Choix manuels** — Nouveaux sorts, capacites de classe, augmentation PV
4. **Resume** — Recap de tout ce qui a change, bouton "Confirmer"

Donnees de progression depuis `class-progression.json`.

## Securite

- Page de login avec mot de passe unique
- Mot de passe compare a une variable d'environnement (`AUTH_PASSWORD`)
- Token JWT en localStorage
- Chaque appel API verifie le token
- Expiration apres quelques jours

## Sorts

- Scrapes une fois depuis un site source (a fournir)
- Stockes dans `data/spells.json`
- Filtres par classe et niveau de sort
- Fiche complete : nom, niveau, portee, duree, composantes, description, degats, effets a niveau superieur

## Hypotheses

- Le site source des sorts sera en francais
- L'evolution du perso suit les regles D&D 5e
- Pas de fonctionnalites de jeu en temps reel (jets de des, combat tracker) pour la v1
- Donnees persistees cote serveur (Upstash)

## Journal de decisions

| Decision | Alternatives | Raison |
|---|---|---|
| Usage personnel, 1 perso | Multi-joueurs, multi-persos | Suffisant pour la v1 |
| Sorts scrapes en JSON | API temps reel, saisie manuelle | Simple, offline, versionne |
| Node.js/Express + Upstash | SQLite, full SPA | Stack connue, bon fit Render |
| JSON pour sorts/progression | Base de donnees | Suffisant pour le volume |
| Navigation par onglets | Page unique | Lisibilite, mobile-friendly |
| Montee de niveau guidee | Edition libre | Respecte les regles D&D 5e |
| Auth mot de passe + JWT | OAuth, sessions | Simple, adapte a un seul user |
