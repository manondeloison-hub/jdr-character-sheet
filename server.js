const express = require('express');
const jwt = require('jsonwebtoken');
const { Redis } = require('@upstash/redis');

// --- Env validation ---
const required = ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'AUTH_PASSWORD', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Variable d'environnement manquante : ${key}`);
    process.exit(1);
  }
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// --- Load static data ---
const allSpells = require('./data/spells.json');
const classProgression = require('./data/class-progression.json');
const allRaces = require('./data/races.json');
const allClasses = require('./data/classes.json');

// --- Default character ---
const DEFAULT_CHARACTER = {
  name: 'Lyrahel "Lyra" Myritar',
  race: 'Haute-Elfe',
  class: 'Magicien',
  subclass: 'École de l\'Évocation',
  level: 2,
  xp: 300,
  stats: {
    strength: 8, dexterity: 16, constitution: 12,
    intelligence: 16, wisdom: 13, charisma: 10,
  },
  statsBase: {
    strength: 8, dexterity: 14, constitution: 12,
    intelligence: 15, wisdom: 13, charisma: 10,
  },
  hp: { max: 14, current: 14 },
  armorClass: 13,
  speed: 9,
  initiative: 3,
  proficiencyBonus: 2,
  savingThrows: ['intelligence', 'wisdom'],
  skills: {},
  equipment: [],
  weapons: [],
  gold: 0,
  traits: ['Vision dans le noir', 'Sens aiguisés', 'Ascendance féerique', 'Transe', 'Cantrip supplémentaire (Haute-Elfe)'],
  classFeatures: ['Incantation', 'Restauration arcanique', 'Tradition arcanique (Évocation)', 'Façonnage des sorts'],
  knownSpells: ['trait-de-feu', 'main-de-mage', 'illusion-mineure', 'prestidigitation', 'armure-de-mage', 'projectile-magique', 'mains-brulantes', 'sommeil'],
  preparedSpells: ['armure-de-mage', 'projectile-magique', 'mains-brulantes', 'sommeil'],
  spellSlots: { '1': 3 },
  spellSlotsUsed: {},
  notes: 'Glass Cannon — frappe fort avec Intelligence et esquive bien grâce à Dextérité, mais éviter le corps à corps !',
};

// --- Express setup ---
const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- Auth (temporairement désactivée) ---
function authMiddleware(req, res, next) {
  return next(); // TODO: réactiver la vérification JWT
  /* eslint-disable no-unreachable */
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  try {
    jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
  /* eslint-enable no-unreachable */
}

app.post('/api/login', (req, res) => {
  if (req.body.password !== process.env.AUTH_PASSWORD) {
    return res.status(403).json({ error: 'Mot de passe incorrect' });
  }
  const token = jwt.sign({ role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// --- Character API ---
app.get('/api/character', authMiddleware, async (req, res) => {
  try {
    let character = await redis.get('character');
    if (!character) {
      character = DEFAULT_CHARACTER;
      await redis.set('character', JSON.stringify(character));
    }
    res.json(character);
  } catch (err) {
    console.error('Erreur Redis GET:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/character', authMiddleware, async (req, res) => {
  try {
    const character = req.body;
    if (!character.name || !character.stats || character.level == null) {
      return res.status(400).json({ error: 'Données invalides' });
    }
    await redis.set('character', JSON.stringify(character));
    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur Redis SET:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Spells API ---
app.get('/api/spells', authMiddleware, (req, res) => {
  const { class: className, maxLevel } = req.query;
  let filtered = allSpells;
  if (className) {
    filtered = filtered.filter(s => s.classes.includes(className.toLowerCase()));
  }
  if (maxLevel != null) {
    filtered = filtered.filter(s => s.level <= parseInt(maxLevel, 10));
  }
  res.json(filtered);
});

// --- Races API ---
app.get('/api/races', authMiddleware, (req, res) => res.json(allRaces));

// --- Classes API ---
app.get('/api/classes', authMiddleware, (req, res) => {
  const { name } = req.query;
  if (name) {
    const data = allClasses[name.toLowerCase()];
    return data ? res.json(data) : res.status(404).json({ error: 'Classe inconnue' });
  }
  res.json(allClasses);
});

// --- Progression API ---
app.get('/api/progression/:className/:level', authMiddleware, (req, res) => {
  const { className, level } = req.params;
  const classData = classProgression[className.toLowerCase()];
  if (!classData) {
    return res.status(404).json({ error: 'Classe inconnue' });
  }
  const levelData = classData.levels[level];
  if (!levelData) {
    return res.status(404).json({ error: 'Niveau inconnu' });
  }
  res.json({ ...levelData, hitDie: classData.hitDie, savingThrows: classData.savingThrows });
});

// --- Health check ---
app.get('/api/health', (req, res) => res.send('ok'));

// --- Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur JDR démarré sur le port ${PORT}`);
  console.log(`${allSpells.length} sorts | ${Object.keys(allRaces).length} races | ${Object.keys(allClasses).length} classes chargés`);
});
