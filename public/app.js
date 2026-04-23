(function () {
  'use strict';

  // --- Constants ---
  const STATS = {
    strength: 'Force',
    dexterity: 'Dextérité',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Sagesse',
    charisma: 'Charisme',
  };

  const SKILLS = [
    { name: 'Acrobaties', ability: 'dexterity' },
    { name: 'Arcanes', ability: 'intelligence' },
    { name: 'Athlétisme', ability: 'strength' },
    { name: 'Discrétion', ability: 'dexterity' },
    { name: 'Dressage', ability: 'wisdom' },
    { name: 'Escamotage', ability: 'dexterity' },
    { name: 'Histoire', ability: 'intelligence' },
    { name: 'Intimidation', ability: 'charisma' },
    { name: 'Investigation', ability: 'intelligence' },
    { name: 'Médecine', ability: 'wisdom' },
    { name: 'Nature', ability: 'intelligence' },
    { name: 'Perception', ability: 'wisdom' },
    { name: 'Perspicacité', ability: 'wisdom' },
    { name: 'Persuasion', ability: 'charisma' },
    { name: 'Religion', ability: 'intelligence' },
    { name: 'Représentation', ability: 'charisma' },
    { name: 'Survie', ability: 'wisdom' },
    { name: 'Tromperie', ability: 'charisma' },
  ];

  // Bonus raciaux D&D 5e (valeur normalisée en minuscules)
  const RACIAL_BONUSES = {
    'haute-elfe':            { dexterity: 2, intelligence: 1 },
    'high elf':              { dexterity: 2, intelligence: 1 },
    'elfe des bois':         { dexterity: 2, wisdom: 1 },
    'wood elf':              { dexterity: 2, wisdom: 1 },
    'elfe noir':             { dexterity: 2, charisma: 1 },
    'drow':                  { dexterity: 2, charisma: 1 },
    'elfe':                  { dexterity: 2 },
    'elf':                   { dexterity: 2 },
    'nain des collines':     { constitution: 2, wisdom: 1 },
    'hill dwarf':            { constitution: 2, wisdom: 1 },
    'nain des montagnes':    { constitution: 2, strength: 2 },
    'mountain dwarf':        { constitution: 2, strength: 2 },
    'nain':                  { constitution: 2 },
    'dwarf':                 { constitution: 2 },
    'humain':                { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    'human':                 { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    'halfelin pied-léger':   { dexterity: 2, charisma: 1 },
    'lightfoot halfling':    { dexterity: 2, charisma: 1 },
    'halfelin robuste':      { dexterity: 2, constitution: 1 },
    'stout halfling':        { dexterity: 2, constitution: 1 },
    'halfelin':              { dexterity: 2 },
    'halfling':              { dexterity: 2 },
    'gnome des roches':      { intelligence: 2, constitution: 1 },
    'rock gnome':            { intelligence: 2, constitution: 1 },
    'gnome des forêts':      { intelligence: 2, dexterity: 1 },
    'forest gnome':          { intelligence: 2, dexterity: 1 },
    'gnome':                 { intelligence: 2 },
    'demi-elfe':             { charisma: 2 },
    'half-elf':              { charisma: 2 },
    'demi-orc':              { strength: 2, constitution: 1 },
    'half-orc':              { strength: 2, constitution: 1 },
    'tieffelin':             { intelligence: 1, charisma: 2 },
    'tiefling':              { intelligence: 1, charisma: 2 },
    'draconide':             { strength: 2, charisma: 1 },
    'dragonborn':            { strength: 2, charisma: 1 },
  };

  const CURRENCIES = [
    { key: 'pp', label: 'Platine',  hint: '1 pp = 10 po' },
    { key: 'po', label: 'Or',       hint: '1 po = 10 pa' },
    { key: 'pe', label: 'Électrum', hint: '1 pe = 5 pa'  },
    { key: 'pa', label: 'Argent',   hint: '1 pa = 10 pc' },
    { key: 'pc', label: 'Cuivre',   hint: ''             },
  ];

  const EQUIP_SLOTS_LEFT = [
    { key: 'head1',  label: 'Tête',       icon: '🪖' },
    { key: 'head2',  label: 'Tête (acc.)', icon: '👓' },
    { key: 'chest',  label: 'Buste',       icon: '🥋' },
    { key: 'legs',   label: 'Jambes',      icon: '👖' },
    { key: 'feet',   label: 'Pieds',       icon: '👢' },
    { key: 'belt',   label: 'Ceinture',    icon: '🪢' },
  ];

  const EQUIP_SLOTS_RIGHT = [
    { key: 'back',        label: 'Dos',        icon: '🧣' },
    { key: 'neck',        label: 'Cou',        icon: '📿' },
    { key: 'wristLeft',   label: 'Poignet G',  icon: '⌚', pairKey: 'wristRight',  pairLabel: 'Poignet D' },
    { key: 'fingerLeft',  label: 'Doigt G',    icon: '💍', pairKey: 'fingerRight', pairLabel: 'Doigt D' },
    { key: 'outfit',      label: 'Tenue',       icon: '👘' },
  ];

  const XP_THRESHOLDS = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
  ];

  // hands: 1 = une main, 2 = deux mains, 'V' = polyvalente
  // icon: emoji affiché sur la ligne d'inventaire
  // baseDmg: type de dégâts de base
  const WEAPON_TYPES = [
    { name: 'Bâton',             cat: 'Corps à corps courante',  hands: 'V', icon: '🪄', baseDmg: 'Contondant'  },
    { name: 'Dague',             cat: 'Corps à corps courante',  hands: 1,   icon: '🗡️', baseDmg: 'Perforant'   },
    { name: 'Faucille',          cat: 'Corps à corps courante',  hands: 1,   icon: '🌙', baseDmg: 'Tranchant'   },
    { name: 'Gourdin',           cat: 'Corps à corps courante',  hands: 1,   icon: '🪵', baseDmg: 'Contondant'  },
    { name: 'Hachette',          cat: 'Corps à corps courante',  hands: 1,   icon: '🪓', baseDmg: 'Tranchant'   },
    { name: 'Javeline',          cat: 'Corps à corps courante',  hands: 1,   icon: '🔱', baseDmg: 'Perforant'   },
    { name: 'Lance',             cat: 'Corps à corps courante',  hands: 'V', icon: '🔱', baseDmg: 'Perforant'   },
    { name: 'Marteau léger',     cat: 'Corps à corps courante',  hands: 1,   icon: '🔨', baseDmg: 'Contondant'  },
    { name: 'Masse d\'armes',    cat: 'Corps à corps courante',  hands: 1,   icon: '🔨', baseDmg: 'Contondant'  },
    { name: 'Serpe',             cat: 'Corps à corps courante',  hands: 1,   icon: '🌙', baseDmg: 'Tranchant'   },
    { name: 'Arbalète légère',   cat: 'Distance courante',       hands: 2,   icon: '🎯', baseDmg: 'Perforant'   },
    { name: 'Arc court',         cat: 'Distance courante',       hands: 2,   icon: '🏹', baseDmg: 'Perforant'   },
    { name: 'Fronde',            cat: 'Distance courante',       hands: 1,   icon: '🪨', baseDmg: 'Contondant'  },
    { name: 'Dard',              cat: 'Distance courante',       hands: 1,   icon: '🎯', baseDmg: 'Perforant'   },
    { name: 'Cimeterre',         cat: 'Corps à corps de guerre', hands: 1,   icon: '⚔️', baseDmg: 'Tranchant'   },
    { name: 'Épée courte',       cat: 'Corps à corps de guerre', hands: 1,   icon: '🗡️', baseDmg: 'Perforant'   },
    { name: 'Épée longue',       cat: 'Corps à corps de guerre', hands: 'V', icon: '⚔️', baseDmg: 'Tranchant'   },
    { name: 'Épée à deux mains', cat: 'Corps à corps de guerre', hands: 2,   icon: '⚔️', baseDmg: 'Tranchant'   },
    { name: 'Fléau',             cat: 'Corps à corps de guerre', hands: 1,   icon: '⛓️', baseDmg: 'Contondant'  },
    { name: 'Fouet',             cat: 'Corps à corps de guerre', hands: 1,   icon: '➿', baseDmg: 'Tranchant'   },
    { name: 'Grande hache',      cat: 'Corps à corps de guerre', hands: 2,   icon: '🪓', baseDmg: 'Tranchant'   },
    { name: 'Hache d\'armes',    cat: 'Corps à corps de guerre', hands: 'V', icon: '🪓', baseDmg: 'Tranchant'   },
    { name: 'Hallebarde',        cat: 'Corps à corps de guerre', hands: 2,   icon: '🔱', baseDmg: 'Tranchant'   },
    { name: 'Lance d\'arçon',    cat: 'Corps à corps de guerre', hands: 2,   icon: '🔱', baseDmg: 'Perforant'   },
    { name: 'Maillet',           cat: 'Corps à corps de guerre', hands: 2,   icon: '🔨', baseDmg: 'Contondant'  },
    { name: 'Marteau de guerre', cat: 'Corps à corps de guerre', hands: 'V', icon: '🔨', baseDmg: 'Contondant'  },
    { name: 'Morgenstern',       cat: 'Corps à corps de guerre', hands: 1,   icon: '🔨', baseDmg: 'Perforant'   },
    { name: 'Pic de guerre',     cat: 'Corps à corps de guerre', hands: 1,   icon: '⛏️', baseDmg: 'Perforant'   },
    { name: 'Rapière',           cat: 'Corps à corps de guerre', hands: 1,   icon: '🤺', baseDmg: 'Perforant'   },
    { name: 'Trident',           cat: 'Corps à corps de guerre', hands: 'V', icon: '🔱', baseDmg: 'Perforant'   },
    { name: 'Coutille',          cat: 'Corps à corps de guerre', hands: 2,   icon: '🔱', baseDmg: 'Tranchant'   },
    { name: 'Arbalète à main',   cat: 'Distance de guerre',      hands: 1,   icon: '🎯', baseDmg: 'Perforant'   },
    { name: 'Arbalète lourde',   cat: 'Distance de guerre',      hands: 2,   icon: '🎯', baseDmg: 'Perforant'   },
    { name: 'Arc long',          cat: 'Distance de guerre',      hands: 2,   icon: '🏹', baseDmg: 'Perforant'   },
    { name: 'Filet',             cat: 'Distance de guerre',      hands: 1,   icon: '🕸️', baseDmg: 'Contondant'  },
    { name: 'Sarbacane',         cat: 'Distance de guerre',      hands: 1,   icon: '💨', baseDmg: 'Perforant'   },
  ];

  const WEAPON_PROPERTIES = ['Allonge', 'Chargement', 'Dissimulée', 'Finesse', 'Lance', 'Légère', 'Lourde', 'Munitions', 'Spéciale'];

  const WEAPON_TYPE_CATS = ['Tous', 'Corps à corps courante', 'Corps à corps de guerre', 'Distance courante', 'Distance de guerre'];

  const DAMAGE_TYPES = ['Acide', 'Contondant', 'Éclair', 'Feu', 'Force', 'Froid', 'Nécrotique', 'Perforant', 'Poison', 'Psychique', 'Radiant', 'Tonnerre', 'Tranchant'];

  const RECOVERY_OPTIONS = ['Repos long', 'Repos court', 'Chaque aube', 'À volonté'];

  const POTIONS = [
    { name: 'Potion de soins',              cat: 'Soins',           desc: '2d4+2 PV' },
    { name: 'Potion de soins supérieure',   cat: 'Soins',           desc: '4d4+4 PV' },
    { name: 'Potion de soins excellente',   cat: 'Soins',           desc: '8d4+8 PV' },
    { name: 'Potion de soins suprême',      cat: 'Soins',           desc: '10d4+20 PV' },
    { name: 'Élixir de santé',              cat: 'Soins',           desc: 'Supprime maladies et états' },
    { name: 'Potion de résistance',         cat: 'Soins',           desc: 'Résistance à un type de dégâts pendant 1h' },
    { name: 'Potion de vaillance',          cat: 'Soins',           desc: 'Immunité à la peur, 5 PV temp. pendant 1h' },
    { name: 'Potion de force de géant des collines',  cat: 'Caractéristiques', desc: 'FOR 21 pendant 1h' },
    { name: 'Potion de force de géant de pierre',     cat: 'Caractéristiques', desc: 'FOR 23 pendant 1h' },
    { name: 'Potion de force de géant de givre',      cat: 'Caractéristiques', desc: 'FOR 29 pendant 1h' },
    { name: 'Potion de force de géant du feu',        cat: 'Caractéristiques', desc: 'FOR 25 pendant 1h' },
    { name: 'Potion de force de géant des nuages',    cat: 'Caractéristiques', desc: 'FOR 27 pendant 1h' },
    { name: 'Potion de force de géant des tempêtes',  cat: 'Caractéristiques', desc: 'FOR 29 pendant 1h' },
    { name: 'Potion d\'invulnérabilité',    cat: 'Caractéristiques', desc: 'Résistance à tous les dégâts pendant 1 min' },
    { name: 'Potion de vitesse',            cat: 'Mobilité',        desc: 'Effet Hâte pendant 1 min' },
    { name: 'Potion de vol',                cat: 'Mobilité',        desc: 'Vitesse de vol 60 ft pendant 1h' },
    { name: 'Potion d\'escalade',           cat: 'Mobilité',        desc: 'Vitesse d\'escalade égale à la vitesse pendant 1h' },
    { name: 'Potion de respiration aquatique', cat: 'Mobilité',     desc: 'Respirer sous l\'eau pendant 1h' },
    { name: 'Huile glissante',              cat: 'Mobilité',        desc: 'Surface ou créature glissante' },
    { name: 'Potion de forme gazeuse',      cat: 'Transformation',  desc: 'Forme gazeuse pendant 1h' },
    { name: 'Potion de rétrécissement',     cat: 'Transformation',  desc: 'Taille réduite de moitié pendant 1d4h' },
    { name: 'Potion d\'agrandissement',     cat: 'Transformation',  desc: 'Taille doublée pendant 1d4h' },
    { name: 'Potion de métamorphose animale', cat: 'Transformation', desc: 'Se transformer en animal CR ≤ 1 pendant 1h' },
    { name: 'Potion d\'invisibilité',       cat: 'Autres',          desc: 'Invisible jusqu\'à attaque ou sort' },
    { name: 'Potion de lecture des pensées',cat: 'Autres',          desc: 'Détection des pensées pendant 1h' },
    { name: 'Philtre d\'amour',             cat: 'Autres',          desc: 'Charme une créature pendant 1h' },
    { name: 'Huile éthérée',               cat: 'Autres',          desc: 'Plan éthéré pendant 1h' },
  ];

  const POTION_CATS = ['Toutes', 'Soins', 'Caractéristiques', 'Mobilité', 'Transformation', 'Autres'];

  // --- State ---
  let character = null;
  let spellsCache = null;
  let saveTimeout = null;
  let editMode = false;
  let consumablesCollapsed = true;
  let questCollapsed = true;
  let weaponsInvCollapsed = true;
  let scrollsCollapsed = true;
  let weaponTypeCatFilter = 'Tous';
  let allSpellsCache = null;
  let weaponEditIndex = null;

  // --- DOM refs ---
  const $login = document.getElementById('login');
  const $loginForm = document.getElementById('login-form');
  const $loginPassword = document.getElementById('login-password');
  const $loginError = document.getElementById('login-error');
  const $app = document.getElementById('app');
  const $headerName = document.getElementById('header-name');
  const $headerRace = document.getElementById('header-race');
  const $headerClass = document.getElementById('header-class');
  const $headerLevel = document.getElementById('header-level');
  const $headerHp = document.getElementById('header-hp');
  const $headerXp = document.getElementById('header-xp');
  const $btnLevelUp = document.getElementById('btn-level-up');
  const $tabs = document.querySelectorAll('.tab');
  const $tabContents = document.querySelectorAll('.tab-content');
  const $spellModal = document.getElementById('spell-modal');
  const $levelupModal = document.getElementById('levelup-modal');
  const $levelupContent = document.getElementById('levelup-content');

  // --- API helper ---
  function apiFetch(url, options = {}) {
    const token = localStorage.getItem('jdr-token');
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (options.body) headers['Content-Type'] = 'application/json';
    return fetch(url, { ...options, headers });
  }

  // --- Auth ---
  $loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    $loginError.classList.add('hidden');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: $loginPassword.value }),
    });
    if (!res.ok) {
      $loginError.classList.remove('hidden');
      return;
    }
    const data = await res.json();
    localStorage.setItem('jdr-token', data.token);
    loadApp();
  });

  async function loadApp() {
    const res = await apiFetch('/api/character');
    if (!res.ok) {
      localStorage.removeItem('jdr-token');
      $login.classList.remove('hidden');
      $app.classList.add('hidden');
      return;
    }
    character = await res.json();
    initStatsBase();
    $login.classList.add('hidden');
    $app.classList.remove('hidden');
    renderAll();
  }

  // --- Save ---
  function saveCharacter() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      await apiFetch('/api/character', {
        method: 'PUT',
        body: JSON.stringify(character),
      });
    }, 500);
  }

  function mod(val) {
    return Math.floor((val - 10) / 2);
  }

  function modStr(val) {
    const m = mod(val);
    return m >= 0 ? '+' + m : '' + m;
  }

  // --- Tabs ---
  $tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      $tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      $tabContents.forEach((tc) => {
        tc.classList.toggle('hidden', tc.id !== 'tab-' + target);
      });
      if (target === 'sorts' && !spellsCache) loadSpells();
    });
  });

  function profBonusFromLevel(level) {
    return Math.floor((level - 1) / 4) + 2;
  }

  function getRacialBonus(race) {
    if (!race) return {};
    return RACIAL_BONUSES[race.toLowerCase().trim()] || {};
  }

  function recalcStats() {
    const racial = getRacialBonus(character.race);
    for (const key of Object.keys(STATS)) {
      character.stats[key] = (character.statsBase[key] || 10) + (racial[key] || 0);
    }
  }

  // Migration : si statsBase absent, déduire les bases depuis les totaux actuels
  function initStatsBase() {
    if (!character.statsBase) {
      character.statsBase = {};
      const racial = getRacialBonus(character.race);
      for (const key of Object.keys(STATS)) {
        character.statsBase[key] = (character.stats[key] || 10) - (racial[key] || 0);
      }
    }
  }

  // --- Render all ---
  function renderAll() {
    renderHeader();
    renderXp();
    renderProfil();
    renderDeathSaves();
    renderCombat();
    renderCapacites();
    renderInventaire();
    renderSpellSlots();
    if (spellsCache) renderSpellsList();
  }

  // --- Jets contre la mort ---
  function renderDeathSaves() {
    const section = document.getElementById('death-saves-section');
    if (character.hp.current > 0) {
      section.classList.add('hidden');
      return;
    }
    section.classList.remove('hidden');

    if (!character.deathSaves) character.deathSaves = { successes: 0, failures: 0 };
    const ds = character.deathSaves;

    function buildCircles(containerId, type, count, colorClass) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const circle = document.createElement('span');
        circle.className = 'death-circle ' + colorClass + (i < count ? ' filled' : '');
        circle.addEventListener('click', () => {
          // Clic sur un cercle rempli = on retire, sur vide = on ajoute
          ds[type] = (i < ds[type]) ? i : Math.min(3, i + 1);
          saveCharacter();
          renderDeathSaves();
        });
        container.appendChild(circle);
      }
    }

    buildCircles('death-success-circles', 'successes', ds.successes, 'circle-success');
    buildCircles('death-failure-circles', 'failures',  ds.failures,  'circle-failure');

    const $status = document.getElementById('death-status');
    if (ds.failures >= 3) {
      $status.textContent = 'Mort(e)…';
      $status.className = 'death-status status-dead';
    } else if (ds.successes >= 3) {
      $status.textContent = 'Stabilisé(e) ✓';
      $status.className = 'death-status status-stable';
    } else {
      $status.textContent = '';
      $status.className = 'death-status';
    }
  }

  // --- Header ---
  function renderHeader() {
    $headerName.textContent = character.name || '—';
    $headerRace.textContent = character.race || '—';
    $headerClass.textContent = character.class || '—';
    $headerLevel.textContent = character.level;
    $headerHp.textContent = character.hp.current + ' / ' + character.hp.max;
    $headerXp.textContent = character.xp;

    const canLevelUp = character.level < 20 && character.xp >= XP_THRESHOLDS[character.level];
    $btnLevelUp.classList.toggle('hidden', !canLevelUp);
  }

  // --- XP & Niveau ---
  function renderXp() {
    const xp    = character.xp || 0;
    const level = character.level || 1;

    document.getElementById('xp-level-value').textContent = level;
    document.getElementById('xp-prof-value').textContent  = '+' + profBonusFromLevel(level);
    document.getElementById('xp-current-display').textContent = xp.toLocaleString('fr-FR') + ' XP';

    if (level >= 20) {
      document.getElementById('xp-next-display').textContent = 'Niveau maximum atteint';
      document.getElementById('xp-bar').style.width = '100%';
    } else {
      const xpCurrent = XP_THRESHOLDS[level - 1];
      const xpNext    = XP_THRESHOLDS[level];
      const pct = Math.min(100, Math.max(0, ((xp - xpCurrent) / (xpNext - xpCurrent)) * 100));
      document.getElementById('xp-next-display').textContent =
        '/ ' + xpNext.toLocaleString('fr-FR') + ' XP pour niveau ' + (level + 1);
      document.getElementById('xp-bar').style.width = pct + '%';
    }
  }

  function addXp(amount) {
    if (!amount || amount <= 0) return;
    character.xp = (character.xp || 0) + amount;

    // Montée(s) de niveau automatique(s)
    while (character.level < 20 && character.xp >= XP_THRESHOLDS[character.level]) {
      character.level += 1;
      character.proficiencyBonus = profBonusFromLevel(character.level);
    }

    saveCharacter();
    renderXp();
    renderHeader();
    renderProfil(); // met à jour le bonus de maîtrise affiché
  }

  document.getElementById('btn-add-xp').addEventListener('click', () => {
    const input = document.getElementById('xp-add-input');
    const amount = parseInt(input.value, 10);
    if (!amount || amount <= 0) return;
    addXp(amount);
    input.value = '';
  });

  document.getElementById('xp-add-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-add-xp').click();
  });

  // --- Profil ---
  function renderProfil() {
    // Bouton mode édition
    const $btn = document.getElementById('btn-edit-mode');
    if ($btn) {
      $btn.textContent = editMode ? '🔒 Verrouiller' : '✏️ Modifier';
      $btn.classList.toggle('btn-edit-active', editMode);
    }

    // Info fields (inputs + selects)
    document.querySelectorAll('.info-field input, .info-field select').forEach((el) => {
      const field = el.dataset.field;
      el.value = character[field] || '';
      el.disabled = !editMode;
      el.onchange = () => {
        character[field] = el.value;
        if (field === 'race') {
          recalcStats();
          renderProfil();
          renderCombat();
        }
        saveCharacter();
        renderHeader();
      };
    });

    // Stats
    const $grid = document.getElementById('stats-grid');
    $grid.innerHTML = '';
    const racial = getRacialBonus(character.race);
    for (const [key, label] of Object.entries(STATS)) {
      const base       = character.statsBase[key] || 10;
      const racialVal  = racial[key] || 0;
      const total      = base + racialVal;
      const card = document.createElement('div');
      card.className = 'stat-card';

      let racialBadge = '';
      if (racialVal !== 0) {
        racialBadge = '<div class="stat-racial">' + (racialVal > 0 ? '+' : '') + racialVal + ' race</div>';
      }

      card.innerHTML =
        '<div class="stat-name">' + label + '</div>' +
        '<div class="stat-mod">' + modStr(total) + '</div>' +
        '<div class="stat-total stat-hoverable">' + total + '</div>' +
        (editMode
          ? '<input type="number" value="' + base + '" min="1" max="30">' + racialBadge
          : '');

      // Tooltip au survol de la valeur totale
      const totalEl = card.querySelector('.stat-total');
      totalEl.addEventListener('mouseenter', () => {
        const tooltip = document.getElementById('stat-tooltip');
        let html = '<div class="tt-row"><span>Base</span><span>' + base + '</span></div>';
        if (racialVal !== 0) {
          html += '<div class="tt-row"><span>Race</span><span>' + (racialVal > 0 ? '+' : '') + racialVal + '</span></div>';
        }
        html += '<div class="tt-total"><span>Total</span><span>' + total + '</span></div>';
        tooltip.innerHTML = html;
        tooltip.classList.remove('hidden');
      });
      totalEl.addEventListener('mouseleave', () => {
        document.getElementById('stat-tooltip').classList.add('hidden');
      });

      if (editMode) {
        card.querySelector('input').addEventListener('change', (e) => {
          character.statsBase[key] = parseInt(e.target.value, 10) || 10;
          recalcStats();
          saveCharacter();
          renderProfil();
          renderCombat();
          renderHeader();
        });
      }

      $grid.appendChild(card);
    }

    // Saving throws
    const $saves = document.getElementById('saving-throws');
    $saves.innerHTML = '';
    for (const [key, label] of Object.entries(STATS)) {
      const proficient = (character.savingThrows || []).includes(key);
      const bonus = mod(character.stats[key]) + (proficient ? character.proficiencyBonus : 0);
      const row = document.createElement('div');
      row.className = 'save-row';
      row.innerHTML =
        '<input type="checkbox"' + (proficient ? ' checked' : '') + (editMode ? '' : ' disabled') + '>' +
        '<span>' + label + '</span>' +
        '<span class="bonus">' + (bonus >= 0 ? '+' : '') + bonus + '</span>';
      row.querySelector('input').addEventListener('change', (e) => {
        if (!character.savingThrows) character.savingThrows = [];
        if (e.target.checked) {
          character.savingThrows.push(key);
        } else {
          character.savingThrows = character.savingThrows.filter((s) => s !== key);
        }
        saveCharacter();
        renderProfil();
      });
      $saves.appendChild(row);
    }

    // Skills
    const $skills = document.getElementById('skills-list');
    $skills.innerHTML = '';
    for (const skill of SKILLS) {
      const proficient = character.skills && character.skills[skill.name];
      const bonus = mod(character.stats[skill.ability]) + (proficient ? character.proficiencyBonus : 0);
      const row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML =
        '<input type="checkbox"' + (proficient ? ' checked' : '') + (editMode ? '' : ' disabled') + '>' +
        '<span>' + skill.name + '</span>' +
        '<span class="bonus">' + (bonus >= 0 ? '+' : '') + bonus + '</span>';
      row.querySelector('input').addEventListener('change', (e) => {
        if (!character.skills) character.skills = {};
        character.skills[skill.name] = e.target.checked;
        saveCharacter();
        renderProfil();
      });
      $skills.appendChild(row);
    }

    // Perception passive : 10 + mod(Sagesse) + maîtrise éventuelle
    const perceptionProficient = character.skills && character.skills['Perception'];
    const passivePerception = 10 + mod(character.stats.wisdom) + (perceptionProficient ? character.proficiencyBonus : 0);
    document.getElementById('passive-perception').textContent = passivePerception;

  }

  document.getElementById('btn-edit-mode').addEventListener('click', () => {
    editMode = !editMode;
    renderProfil();
  });

  // Tooltip position
  document.addEventListener('mousemove', (e) => {
    const tooltip = document.getElementById('stat-tooltip');
    if (!tooltip.classList.contains('hidden')) {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 10) + 'px';
    }
  });

  // --- Combat ---
  function renderCombat() {
    const $ac = document.getElementById('combat-ac');
    const $speed = document.getElementById('combat-speed');
    const $init = document.getElementById('combat-init');
    const $prof = document.getElementById('combat-prof');
    const $hpCurrent = document.getElementById('hp-current');
    const $hpMax = document.getElementById('hp-max');
    const $hpBar = document.getElementById('hp-bar');

    $ac.value = character.armorClass;
    $speed.value = character.speed;
    $init.textContent = modStr(character.stats.dexterity);
    $prof.textContent = '+' + character.proficiencyBonus;

    $ac.onchange = () => { character.armorClass = parseInt($ac.value, 10); saveCharacter(); };
    $speed.onchange = () => { character.speed = parseInt($speed.value, 10); saveCharacter(); };

    // HP
    $hpCurrent.textContent = character.hp.current;
    $hpMax.value = character.hp.max;
    document.getElementById('hp-temp').textContent = character.hp.temp || 0;

    $hpMax.onchange = () => {
      character.hp.max = Math.max(1, parseInt($hpMax.value, 10) || 1);
      if (character.hp.current > character.hp.max) character.hp.current = character.hp.max;
      saveCharacter();
      renderCombat();
      renderHeader();
    };

    const pct = Math.max(0, (character.hp.current / character.hp.max) * 100);
    $hpBar.style.width = pct + '%';
    $hpBar.className = 'hp-bar' + (pct <= 25 ? ' danger' : pct <= 50 ? ' warning' : '');

    // Boutons PV actuels
    document.querySelectorAll('[data-hp]').forEach((btn) => {
      btn.onclick = () => {
        const wasZero = character.hp.current === 0;
        const delta = parseInt(btn.dataset.hp, 10);
        character.hp.current = Math.max(0, Math.min(character.hp.max, character.hp.current + delta));
        // Soin après mort imminente : reset des jets
        if (wasZero && character.hp.current > 0) {
          character.deathSaves = { successes: 0, failures: 0 };
        }
        saveCharacter();
        renderCombat();
        renderDeathSaves();
        renderHeader();
      };
    });

    // Boutons PV temporaires
    document.querySelectorAll('[data-hp-temp]').forEach((btn) => {
      btn.onclick = () => {
        const delta = parseInt(btn.dataset.hpTemp, 10);
        character.hp.temp = Math.max(0, (character.hp.temp || 0) + delta);
        saveCharacter();
        document.getElementById('hp-temp').textContent = character.hp.temp;
      };
    });

    // Weapons
    const $weapons = document.getElementById('weapons-list');
    $weapons.innerHTML = '';
    (character.weapons || []).forEach((w, i) => {
      const row = document.createElement('div');
      row.className = 'weapon-row';
      row.innerHTML =
        '<span class="weapon-name">' + w.name + '</span>' +
        '<span class="weapon-atk">' + w.attack + '</span>' +
        '<span class="weapon-dmg">' + w.damage + '</span>' +
        '<button class="btn-remove">&times;</button>';
      row.querySelector('.btn-remove').addEventListener('click', () => {
        character.weapons.splice(i, 1);
        saveCharacter();
        renderCombat();
      });
      $weapons.appendChild(row);
    });

    document.getElementById('btn-add-weapon').onclick = () => {
      const name = document.getElementById('weapon-name');
      const atk = document.getElementById('weapon-atk');
      const dmg = document.getElementById('weapon-dmg');
      if (!name.value) return;
      if (!character.weapons) character.weapons = [];
      character.weapons.push({ name: name.value, attack: atk.value, damage: dmg.value });
      name.value = ''; atk.value = ''; dmg.value = '';
      saveCharacter();
      renderCombat();
    };
  }

  // --- Sorts ---
  async function loadSpells() {
    const maxLevel = maxSpellLevel();
    const res = await apiFetch('/api/spells?class=' + encodeURIComponent(character.class || '') + '&maxLevel=' + maxLevel);
    if (res.ok) {
      spellsCache = await res.json();
      renderSpellsList();
    }
  }

  function maxSpellLevel() {
    const slots = character.spellSlots || {};
    let max = 0;
    for (const lvl of Object.keys(slots)) {
      if (slots[lvl] > 0 && parseInt(lvl, 10) > max) max = parseInt(lvl, 10);
    }
    return max;
  }

  function renderSpellSlots() {
    const $slots = document.getElementById('spell-slots');
    $slots.innerHTML = '';
    const slots = character.spellSlots || {};
    const used = character.spellSlotsUsed || {};

    for (const [lvl, total] of Object.entries(slots)) {
      if (total <= 0) continue;
      const group = document.createElement('div');
      group.className = 'slot-group';
      group.innerHTML = '<div class="slot-label">Niv. ' + lvl + '</div>';
      const circles = document.createElement('div');
      circles.className = 'slot-circles';
      const usedCount = used[lvl] || 0;
      for (let i = 0; i < total; i++) {
        const circle = document.createElement('div');
        circle.className = 'slot-circle' + (i < usedCount ? ' used' : '');
        circle.addEventListener('click', () => {
          if (!character.spellSlotsUsed) character.spellSlotsUsed = {};
          if (i < (character.spellSlotsUsed[lvl] || 0)) {
            character.spellSlotsUsed[lvl] = i;
          } else {
            character.spellSlotsUsed[lvl] = i + 1;
          }
          saveCharacter();
          renderSpellSlots();
        });
        circles.appendChild(circle);
      }
      group.appendChild(circles);
      $slots.appendChild(group);
    }

    document.getElementById('btn-long-rest').onclick = () => {
      character.spellSlotsUsed = {};
      character.hp.current = character.hp.max;
      saveCharacter();
      renderSpellSlots();
      renderCombat();
      renderHeader();
    };
  }

  function renderSpellsList() {
    const $list = document.getElementById('spells-list');
    const search = (document.getElementById('spell-search').value || '').toLowerCase();
    const levelFilter = document.getElementById('spell-level-filter').value;
    $list.innerHTML = '';

    if (!spellsCache || spellsCache.length === 0) {
      $list.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem;">Aucun sort chargé. Ajoutez des sorts dans data/spells.json</p>';
      return;
    }

    let filtered = spellsCache;
    if (search) filtered = filtered.filter((s) => s.name.toLowerCase().includes(search));
    if (levelFilter !== '') filtered = filtered.filter((s) => s.level === parseInt(levelFilter, 10));

    // Group by level
    const groups = {};
    for (const spell of filtered) {
      const lvl = spell.level;
      if (!groups[lvl]) groups[lvl] = [];
      groups[lvl].push(spell);
    }

    for (const lvl of Object.keys(groups).sort((a, b) => a - b)) {
      const div = document.createElement('div');
      div.className = 'spell-level-group';
      div.innerHTML = '<h3>' + (lvl === '0' ? 'Cantrips' : 'Niveau ' + lvl) + '</h3>';

      for (const spell of groups[lvl]) {
        const known = (character.knownSpells || []).includes(spell.id);
        if (!known) continue;
        const prepared = (character.preparedSpells || []).includes(spell.id);
        const item = document.createElement('div');
        item.className = 'spell-item';
        item.innerHTML =
          '<span class="spell-name">' + spell.name + '</span>' +
          '<div class="spell-prepared ' + (prepared ? '' : 'not-prepared') + '" title="' + (prepared ? 'Préparé' : 'Non préparé') + '"></div>';

        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('spell-prepared') || e.target.closest('.spell-prepared')) {
            togglePrepared(spell.id);
            return;
          }
          showSpellModal(spell);
        });

        div.appendChild(item);
      }

      if (div.querySelectorAll('.spell-item').length > 0) {
        $list.appendChild(div);
      }
    }
  }

  function togglePrepared(spellId) {
    if (!character.preparedSpells) character.preparedSpells = [];
    const idx = character.preparedSpells.indexOf(spellId);
    if (idx >= 0) {
      character.preparedSpells.splice(idx, 1);
    } else {
      character.preparedSpells.push(spellId);
    }
    saveCharacter();
    renderSpellsList();
  }

  function showSpellModal(spell) {
    document.getElementById('spell-modal-name').textContent = spell.name;
    document.getElementById('spell-modal-meta').innerHTML =
      '<div><strong>Niveau :</strong> ' + (spell.level === 0 ? 'Cantrip' : spell.level) + '</div>' +
      '<div><strong>École :</strong> ' + (spell.school || '—') + '</div>' +
      '<div><strong>Temps d\'incantation :</strong> ' + (spell.castingTime || '—') + '</div>' +
      '<div><strong>Portée :</strong> ' + (spell.range || '—') + '</div>' +
      '<div><strong>Composantes :</strong> ' + (spell.components || '—') + '</div>' +
      '<div><strong>Durée :</strong> ' + (spell.duration || '—') + '</div>';

    let desc = '<p>' + (spell.description || '').replace(/\n/g, '</p><p>') + '</p>';
    if (spell.higherLevels) {
      desc += '<div class="higher-levels"><strong>Aux niveaux supérieurs :</strong> ' + spell.higherLevels + '</div>';
    }
    document.getElementById('spell-modal-desc').innerHTML = desc;
    $spellModal.classList.remove('hidden');
  }

  // Spell filters
  document.getElementById('spell-search').addEventListener('input', renderSpellsList);
  document.getElementById('spell-level-filter').addEventListener('change', renderSpellsList);

  // --- Capacites ---
  function renderCapacites() {
    renderTagList('traits-list', character.traits || [], 'traits');
    renderTagList('features-list', character.classFeatures || [], 'classFeatures');

    const $notes = document.getElementById('notes');
    $notes.value = character.notes || '';
    $notes.onchange = () => {
      character.notes = $notes.value;
      saveCharacter();
    };

    document.getElementById('btn-add-trait').onclick = () => addTag('trait-input', 'traits');
    document.getElementById('btn-add-feature').onclick = () => addTag('feature-input', 'classFeatures');
  }

  function renderTagList(containerId, items, field) {
    const $container = document.getElementById(containerId);
    $container.innerHTML = '';
    items.forEach((item, i) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = item + ' <button class="btn-remove">&times;</button>';
      tag.querySelector('.btn-remove').addEventListener('click', () => {
        character[field].splice(i, 1);
        saveCharacter();
        renderCapacites();
      });
      $container.appendChild(tag);
    });
  }

  function addTag(inputId, field) {
    const input = document.getElementById(inputId);
    if (!input.value.trim()) return;
    if (!character[field]) character[field] = [];
    character[field].push(input.value.trim());
    input.value = '';
    saveCharacter();
    renderCapacites();
  }

  // --- Inventaire ---
  function makeEquipSlot(key, label, icon) {
    if (!character.equipmentSlots) character.equipmentSlots = {};
    const div = document.createElement('div');
    div.className = 'equip-slot';
    const val = character.equipmentSlots[key] || '';
    div.innerHTML =
      '<span class="equip-slot-icon">' + icon + '</span>' +
      '<span class="equip-slot-label">' + label + '</span>' +
      '<input type="text" class="equip-slot-input" placeholder="—" value="' + val.replace(/"/g, '&quot;') + '">';
    div.querySelector('input').addEventListener('change', (e) => {
      if (!character.equipmentSlots) character.equipmentSlots = {};
      character.equipmentSlots[key] = e.target.value;
      saveCharacter();
    });
    return div;
  }

  function renderInventaire() {
    if (!character.equipmentSlots) character.equipmentSlots = {};

    // Slots colonne gauche
    const $left = document.getElementById('equip-col-left');
    $left.innerHTML = '';
    EQUIP_SLOTS_LEFT.forEach(s => $left.appendChild(makeEquipSlot(s.key, s.label, s.icon)));
    $left.appendChild(makeHandSlot('left', 'Main G'));

    // Slots colonne droite (avec paires)
    const $right = document.getElementById('equip-col-right');
    $right.innerHTML = '';
    EQUIP_SLOTS_RIGHT.forEach(s => {
      if (s.pairKey) {
        const pair = document.createElement('div');
        pair.className = 'equip-slot-pair';
        pair.appendChild(makeEquipSlot(s.key, s.label, s.icon));
        pair.appendChild(makeEquipSlot(s.pairKey, s.pairLabel, s.icon));
        $right.appendChild(pair);
      } else {
        $right.appendChild(makeEquipSlot(s.key, s.label, s.icon));
      }
    });
    $right.appendChild(makeHandSlot('right', 'Main D'));

    // Portrait
    const $portrait = document.getElementById('equip-portrait-display');
    const url = character.portrait || '';
    if (url) {
      $portrait.innerHTML = '<img src="' + url + '" alt="Portrait" class="equip-portrait-img">';
      $portrait.classList.remove('equip-portrait-placeholder');
    } else {
      $portrait.innerHTML = '<span class="portrait-icon">👤</span>';
      $portrait.classList.add('equip-portrait-placeholder');
    }

    // Monnaie — migration depuis l'ancien champ gold
    if (!character.currency) {
      character.currency = { pp: 0, po: character.gold || 0, pe: 0, pa: 0, pc: 0 };
    }

    const $currency = document.getElementById('currency-display');
    $currency.innerHTML = '';
    CURRENCIES.forEach(({ key, label }) => {
      const item = document.createElement('div');
      item.className = 'currency-item currency-' + key;
      item.innerHTML =
        '<span class="currency-coin">' + key + '</span>' +
        '<span class="currency-name">' + label + '</span>' +
        '<div class="currency-controls">' +
          '<button class="btn-currency" data-ckey="' + key + '" data-delta="-1">−</button>' +
          '<span class="currency-value" id="val-' + key + '">' + (character.currency[key] || 0) + '</span>' +
          '<button class="btn-currency" data-ckey="' + key + '" data-delta="1">+</button>' +
        '</div>';
      item.querySelectorAll('.btn-currency').forEach(btn => {
        btn.addEventListener('click', () => {
          const k = btn.dataset.ckey;
          const d = parseInt(btn.dataset.delta, 10);
          character.currency[k] = Math.max(0, (character.currency[k] || 0) + d);
          document.getElementById('val-' + k).textContent = character.currency[k];
          saveCharacter();
        });
      });
      $currency.appendChild(item);
    });

    // Armes inventaire
    if (!character.inventoryWeapons) character.inventoryWeapons = [];
    const $wlist = document.getElementById('weapons-inv-list');
    $wlist.innerHTML = '';
    document.getElementById('weapons-inv-toggle').textContent = weaponsInvCollapsed ? '▶' : '▼';
    document.getElementById('weapons-inv-body').classList.toggle('hidden', weaponsInvCollapsed);
    if (!weaponsInvCollapsed) {
      character.inventoryWeapons.forEach((w, i) => {
        const wt     = WEAPON_TYPES.find(t => t.name === w.type) || {};
        const icon   = wt.icon || '⚔️';
        const equipped = !!w.equipped;

        // Tags dégâts : base + bonus
        let dmgTags = '';
        if (wt.baseDmg) dmgTags += '<span class="wtag wtag-dmg">' + wt.baseDmg + '</span>';
        (w.damageBonus || []).forEach(d => {
          if (d.type && d.amount) dmgTags += '<span class="wtag wtag-dmg">' + d.amount + ' ' + d.type + '</span>';
        });

        // Tags propriétés
        let propTags = '';
        if (w.hands === 'V')  propTags += '<span class="wtag wtag-prop">Polyvalente</span>';
        if (w.hands === 2)    propTags += '<span class="wtag wtag-prop">2 mains</span>';
        (w.properties || []).forEach(p => { propTags += '<span class="wtag wtag-prop">' + p + '</span>'; });
        if (w.atkBonus)       propTags += '<span class="wtag wtag-bonus">' + w.atkBonus + '</span>';
        if (w.spells && w.spells.length) propTags += '<span class="wtag wtag-spell">✨ ' + w.spells.length + ' sort' + (w.spells.length > 1 ? 's' : '') + '</span>';

        const row = document.createElement('div');
        row.className = 'weapon-inv-row' + (equipped ? ' weapon-equipped' : '');
        row.innerHTML =
          '<span class="weapon-inv-icon">' + icon + '</span>' +
          '<div class="weapon-inv-body">' +
            '<div class="weapon-inv-top">' +
              '<span class="weapon-inv-name">' + w.name + '</span>' +
              (w.type ? '<span class="weapon-inv-type">' + w.type + '</span>' : '') +
              '<button class="btn-weapon-equip' + (equipped ? ' is-equipped' : '') + '" data-i="' + i + '" title="' + (equipped ? 'Équipée — cliquer pour déséquiper' : 'Non équipée — cliquer pour équiper') + '">' +
                (equipped ? '✅' : '○') +
              '</button>' +
            '</div>' +
            (dmgTags || propTags ? '<div class="weapon-inv-tags">' + dmgTags + propTags + '</div>' : '') +
          '</div>';

        row.querySelector('.btn-weapon-equip').addEventListener('click', (e) => {
          e.stopPropagation();
          character.inventoryWeapons[i].equipped = !character.inventoryWeapons[i].equipped;
          saveCharacter();
          renderInventaire();
        });
        row.addEventListener('click', () => openWeaponDetail(i));
        $wlist.appendChild(row);
      });
    }
    document.getElementById('btn-add-weapon-inv').onclick = () => openWeaponModal(null);

    // Parchemins de sort
    if (!character.spellScrolls) character.spellScrolls = [];
    const $scrolls = document.getElementById('scrolls-list');
    $scrolls.innerHTML = '';
    document.getElementById('scrolls-toggle').textContent = scrollsCollapsed ? '▶' : '▼';
    document.getElementById('scrolls-body').classList.toggle('hidden', scrollsCollapsed);
    if (!scrollsCollapsed) {
      character.spellScrolls.forEach((sc, i) => {
        const row = document.createElement('div');
        row.className = 'consommable-row';
        row.innerHTML =
          '<div class="consommable-info">' +
            '<div class="consommable-header-row">' +
              '<span class="consommable-name">📜 ' + sc.name + '</span>' +
              '<span class="consommable-tag cat-parchemin">Niv. ' + (sc.level === 0 ? 'C' : sc.level) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="consommable-ctrl">' +
            '<button class="btn-qty-c" data-i="' + i + '" data-d="-1">−</button>' +
            '<span class="consommable-qty">' + (sc.qty || 1) + '</span>' +
            '<button class="btn-qty-c" data-i="' + i + '" data-d="1">+</button>' +
            '<button class="btn-remove-c" data-i="' + i + '">✕</button>' +
          '</div>';

        row.querySelectorAll('.btn-qty-c').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.i, 10);
            const newQty = (character.spellScrolls[idx].qty || 1) + parseInt(btn.dataset.d, 10);
            if (newQty < 1) return;
            character.spellScrolls[idx].qty = newQty;
            saveCharacter();
            renderInventaire();
          });
        });
        row.querySelector('.btn-remove-c').addEventListener('click', () => {
          character.spellScrolls.splice(i, 1);
          saveCharacter();
          renderInventaire();
        });
        $scrolls.appendChild(row);
      });
    }
    document.getElementById('btn-add-scroll').onclick = () => openScrollModal();

    // Consommables
    const $equip = document.getElementById('equipment-list');
    $equip.innerHTML = '';
    document.getElementById('consommables-toggle').textContent = consumablesCollapsed ? '▶' : '▼';
    document.getElementById('consommables-body').classList.toggle('hidden', consumablesCollapsed);

    if (!consumablesCollapsed) {
      (character.equipment || []).forEach((item, i) => {
        // Migration : anciens items stockés comme string
        const name = typeof item === 'string' ? item : item.name;
        const desc = typeof item === 'string' ? '' : (item.desc || '');
        const cat  = typeof item === 'string' ? '' : (item.cat  || '');
        const qty  = typeof item === 'string' ? 1  : (item.qty  || 1);
        const catSlug = cat.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');

        const row = document.createElement('div');
        row.className = 'consommable-row';
        row.innerHTML =
          '<div class="consommable-info">' +
            '<div class="consommable-header-row">' +
              '<span class="consommable-name">' + name + '</span>' +
              (cat ? '<span class="consommable-tag cat-' + catSlug + '">' + cat + '</span>' : '') +
            '</div>' +
            (desc ? '<span class="consommable-desc">' + desc + '</span>' : '') +
          '</div>' +
          '<div class="consommable-ctrl">' +
            '<button class="btn-qty-c" data-i="' + i + '" data-d="-1">−</button>' +
            '<span class="consommable-qty">' + qty + '</span>' +
            '<button class="btn-qty-c" data-i="' + i + '" data-d="1">+</button>' +
            '<button class="btn-remove-c" data-i="' + i + '">✕</button>' +
          '</div>';

        row.querySelectorAll('.btn-qty-c').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.i, 10);
            const it = character.equipment[idx];
            const newQty = ((typeof it === 'string' ? 1 : it.qty) || 1) + parseInt(btn.dataset.d, 10);
            if (newQty < 1) return;
            if (typeof it === 'string') character.equipment[idx] = { name: it, desc: '', qty: newQty };
            else it.qty = newQty;
            saveCharacter();
            renderInventaire();
          });
        });

        row.querySelector('.btn-remove-c').addEventListener('click', () => {
          character.equipment.splice(i, 1);
          saveCharacter();
          renderInventaire();
        });

        $equip.appendChild(row);
      });
    }

    document.getElementById('btn-add-equip').onclick = () => openPotionModal();

    // Objets de quête
    if (!character.questItems) character.questItems = [];
    const $quest = document.getElementById('quest-list');
    $quest.innerHTML = '';
    document.getElementById('quetes-toggle').textContent = questCollapsed ? '▶' : '▼';
    document.getElementById('quetes-body').classList.toggle('hidden', questCollapsed);

    if (!questCollapsed) {
      character.questItems.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'quest-row';
        row.innerHTML = '<span class="quest-name">' + item.name + '</span>';
        if (item.desc) row.innerHTML += '<span class="quest-has-desc" title="A une description">📖</span>';
        row.addEventListener('click', () => openQuestDetail(i));
        $quest.appendChild(row);
      });
    }

    document.getElementById('btn-add-quest').onclick = () => openQuestAddModal();
  }

  // --- Potion Modal ---
  let potionCatFilter = 'Toutes';

  function openPotionModal() {
    potionCatFilter = 'Toutes';
    document.getElementById('potion-search').value = '';
    renderPotionFilters();
    renderPotionList();
    document.getElementById('potion-modal').classList.remove('hidden');
  }

  function renderPotionFilters() {
    const $f = document.getElementById('potion-filters');
    $f.innerHTML = '';
    POTION_CATS.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'potion-filter-btn' + (cat === potionCatFilter ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        potionCatFilter = cat;
        renderPotionFilters();
        renderPotionList();
      });
      $f.appendChild(btn);
    });
  }

  function renderPotionList() {
    const $list = document.getElementById('potion-list');
    const search = document.getElementById('potion-search').value.toLowerCase();
    $list.innerHTML = '';

    const filtered = POTIONS.filter(p => {
      const matchCat = potionCatFilter === 'Toutes' || p.cat === potionCatFilter;
      const matchSearch = !search || p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      $list.innerHTML = '<p class="potion-empty">Aucune potion trouvée.</p>';
      return;
    }

    filtered.forEach(potion => {
      const row = document.createElement('div');
      row.className = 'potion-row';
      row.innerHTML =
        '<div class="potion-info">' +
          '<span class="potion-name">' + potion.name + '</span>' +
          '<span class="potion-desc">' + potion.desc + '</span>' +
        '</div>' +
        '<div class="potion-add-ctrl">' +
          '<button class="btn-qty-p" data-d="-1">−</button>' +
          '<span class="potion-qty">1</span>' +
          '<button class="btn-qty-p" data-d="1">+</button>' +
          '<button class="btn-potion-add">Ajouter</button>' +
        '</div>';

      const qtyEl = row.querySelector('.potion-qty');
      row.querySelectorAll('.btn-qty-p').forEach(btn => {
        btn.addEventListener('click', () => {
          let q = parseInt(qtyEl.textContent, 10) + parseInt(btn.dataset.d, 10);
          if (q < 1) q = 1;
          qtyEl.textContent = q;
        });
      });

      row.querySelector('.btn-potion-add').addEventListener('click', () => {
        const qty = parseInt(qtyEl.textContent, 10);
        if (!character.equipment) character.equipment = [];
        character.equipment.push({ name: potion.name, desc: potion.desc, cat: potion.cat, qty });
        saveCharacter();
        renderInventaire();
        document.getElementById('potion-modal').classList.add('hidden');
      });

      $list.appendChild(row);
    });
  }

  document.getElementById('potion-search').addEventListener('input', renderPotionList);

  // --- Emplacements main ---
  function getWeaponByName(name) {
    return (character.inventoryWeapons || []).find(w => w.name === name) || null;
  }

  function getWeaponHands(name) {
    if (!name) return 1;
    const w = getWeaponByName(name);
    return w ? (w.hands || 1) : 1;
  }

  function makeHandSlot(side, label) {
    if (!character.handSlots) character.handSlots = { left: '', right: '' };
    const other   = side === 'left' ? 'right' : 'left';
    const myName  = character.handSlots[side]  || '';
    const othName = character.handSlots[other] || '';
    const myH     = getWeaponHands(myName);
    const othH    = getWeaponHands(othName);

    // Ce slot est bloqué par une arme 2M dans l'autre main
    const lockedBy2H = othName && othH === 2;
    // Ce slot contient une arme polyvalente tenue à 2 mains (autre main vide)
    const versatile2H = myName && myH === 'V' && !othName;

    const div = document.createElement('div');
    div.className = 'equip-slot hand-slot' + (lockedBy2H ? ' hand-locked' : '');

    if (lockedBy2H) {
      div.innerHTML =
        '<span class="equip-slot-icon">🔒</span>' +
        '<span class="equip-slot-label">' + label + '</span>' +
        '<span class="hand-locked-label">' + othName + '</span>';
      return div;
    }

    const icon = myName ? (getWeaponByName(myName) ? '⚔️' : '🛡️') : '✋';
    div.innerHTML =
      '<span class="equip-slot-icon">' + icon + '</span>' +
      '<span class="equip-slot-label">' + label + '</span>' +
      '<div class="hand-slot-picker">' +
        '<span class="hand-slot-name">' + (myName || '—') + '</span>' +
        '<button class="btn-hand-pick" data-side="' + side + '">▾</button>' +
        (myName ? '<button class="btn-hand-clear" data-side="' + side + '">✕</button>' : '') +
      '</div>' +
      (versatile2H ? '<span class="hand-versatile-badge">2 mains</span>' : '');

    // Dropdown picker
    div.querySelector('.btn-hand-pick').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.hand-slot-dropdown').forEach(d => d.remove());
      const dropdown = document.createElement('div');
      dropdown.className = 'hand-slot-dropdown';

      const weapons = character.inventoryWeapons || [];
      if (weapons.length === 0) {
        dropdown.innerHTML = '<div class="hand-drop-empty">Aucune arme dans l\'inventaire</div>';
      } else {
        weapons.forEach(w => {
          const opt = document.createElement('div');
          opt.className = 'hand-drop-item';
          const handsLabel = w.hands === 2 ? '(2M)' : w.hands === 'V' ? '(Poly.)' : '(1M)';
          opt.innerHTML = '<span>' + w.name + '</span><span class="hand-drop-tag">' + handsLabel + '</span>';
          opt.addEventListener('click', () => {
            if (!character.handSlots) character.handSlots = { left: '', right: '' };
            character.handSlots[side] = w.name;
            // Arme 2 mains : libérer l'autre main automatiquement
            if (w.hands === 2) character.handSlots[other] = '';
            saveCharacter();
            renderInventaire();
            dropdown.remove();
          });
          dropdown.appendChild(opt);
        });
      }

      // Texte libre
      const freeRow = document.createElement('div');
      freeRow.className = 'hand-drop-free';
      freeRow.innerHTML = '<input type="text" placeholder="Autre (bouclier, torche…)" value="' + (myName && !getWeaponByName(myName) ? myName : '') + '">';
      freeRow.querySelector('input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          character.handSlots[side] = e.target.value.trim();
          saveCharacter();
          renderInventaire();
          dropdown.remove();
        }
      });
      dropdown.appendChild(freeRow);

      div.appendChild(dropdown);
      setTimeout(() => document.addEventListener('click', () => dropdown.remove(), { once: true }), 0);
    });

    const clearBtn = div.querySelector('.btn-hand-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        character.handSlots[side] = '';
        saveCharacter();
        renderInventaire();
      });
    }

    return div;
  }

  document.getElementById('weapons-inv-header').addEventListener('click', () => {
    weaponsInvCollapsed = !weaponsInvCollapsed;
    renderInventaire();
  });

  // --- Weapon modal ---
  async function fetchAllSpells() {
    if (allSpellsCache) return allSpellsCache;
    const res = await apiFetch('/api/spells');
    if (res.ok) allSpellsCache = await res.json();
    return allSpellsCache || [];
  }

  function openWeaponModal(editIdx) {
    weaponEditIndex = editIdx;
    const modal = document.getElementById('weapon-inv-modal');
    const w = editIdx !== null ? character.inventoryWeapons[editIdx] : null;

    document.getElementById('weapon-modal-title').textContent = w ? 'Modifier l\'arme' : 'Ajouter une arme';
    document.getElementById('btn-wm-confirm').textContent = w ? 'Enregistrer' : 'Ajouter';
    document.getElementById('wm-name').value = w ? w.name : '';
    document.getElementById('wm-atk-bonus').value = w ? (w.atkBonus || '') : '';
    document.getElementById('wm-hands').value = w ? (w.hands || 1) : 1;
    document.getElementById('wm-desc').value = w ? (w.desc || '') : '';
    document.getElementById('wm-type-search').value = '';
    weaponTypeCatFilter = 'Tous';

    // Type sélectionné
    const selType = w ? (w.type || '') : '';
    const $sel = document.getElementById('wm-type-selected');
    if (selType) { $sel.textContent = selType; $sel.classList.remove('hidden'); $sel.dataset.value = selType; }
    else { $sel.textContent = ''; $sel.classList.add('hidden'); $sel.dataset.value = ''; }

    // Dégâts bonus
    const dmgRows = w ? (w.damageBonus || []) : [];
    renderWmDmgRows(dmgRows.map(d => ({ type: d.type, amount: d.amount })));

    // Propriétés
    renderWmProperties(w ? (w.properties || []) : []);

    // Sorts
    renderWmSpellSelected(w ? (w.spells || []) : []);

    renderWmTypeFilters();
    renderWmTypeList();
    renderWmSpellResults('');
    modal.classList.remove('hidden');
    document.getElementById('wm-name').focus();
  }

  function renderWmTypeFilters() {
    const $f = document.getElementById('wm-type-filters');
    $f.innerHTML = '';
    WEAPON_TYPE_CATS.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'potion-filter-btn' + (cat === weaponTypeCatFilter ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => { weaponTypeCatFilter = cat; renderWmTypeFilters(); renderWmTypeList(); });
      $f.appendChild(btn);
    });
  }

  function renderWmTypeList() {
    const $list = document.getElementById('wm-type-list');
    const search = document.getElementById('wm-type-search').value.toLowerCase();
    $list.innerHTML = '';
    const selVal = document.getElementById('wm-type-selected').dataset.value || '';

    WEAPON_TYPES
      .filter(wt => (weaponTypeCatFilter === 'Tous' || wt.cat === weaponTypeCatFilter) && (!search || wt.name.toLowerCase().includes(search)))
      .forEach(wt => {
        const item = document.createElement('div');
        item.className = 'wm-type-item' + (wt.name === selVal ? ' selected' : '');
        item.textContent = wt.name;
        item.addEventListener('click', () => {
          const $sel = document.getElementById('wm-type-selected');
          $sel.textContent = wt.name;
          $sel.dataset.value = wt.name;
          $sel.classList.remove('hidden');
          if (wt.hands) document.getElementById('wm-hands').value = wt.hands;
          renderWmTypeList();
        });
        $list.appendChild(item);
      });
  }

  document.getElementById('wm-type-search').addEventListener('input', renderWmTypeList);

  // Dégâts bonus
  function renderWmDmgRows(rows) {
    const $c = document.getElementById('wm-dmg-rows');
    $c.innerHTML = '';
    rows.forEach((row, i) => {
      const div = document.createElement('div');
      div.className = 'wm-dmg-row';
      div.innerHTML =
        '<select class="wm-dmg-type wm-select">' +
          DAMAGE_TYPES.map(t => '<option value="' + t + '"' + (t === row.type ? ' selected' : '') + '>' + t + '</option>').join('') +
        '</select>' +
        '<input type="text" class="wm-dmg-amount" placeholder="+1d6" value="' + (row.amount || '') + '">' +
        '<button class="btn-wm-del-dmg">✕</button>';
      div.querySelector('.btn-wm-del-dmg').addEventListener('click', () => {
        rows.splice(i, 1);
        renderWmDmgRows(rows);
      });
      $c.appendChild(div);
    });
    $c._rows = rows;
  }

  document.getElementById('btn-wm-add-dmg').addEventListener('click', () => {
    const $c = document.getElementById('wm-dmg-rows');
    const rows = $c._rows || [];
    rows.push({ type: 'Radiant', amount: '' });
    renderWmDmgRows(rows);
  });

  function renderWmProperties(selected) {
    const $c = document.getElementById('wm-properties');
    $c.innerHTML = '';
    WEAPON_PROPERTIES.forEach(prop => {
      const label = document.createElement('label');
      label.className = 'wm-prop-label';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = prop;
      cb.checked = selected.includes(prop);
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + prop));
      $c.appendChild(label);
    });
  }

  // Sorts
  async function renderWmSpellResults(search) {
    const $r = document.getElementById('wm-spell-results');
    $r.innerHTML = '';
    if (!search) return;
    const spells = await fetchAllSpells();
    const filtered = spells.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
    filtered.forEach(spell => {
      const item = document.createElement('div');
      item.className = 'wm-spell-result-item';
      item.textContent = spell.name + (spell.level === 0 ? ' (cantrip)' : ' (niv.' + spell.level + ')');
      item.addEventListener('click', () => {
        const $sel = document.getElementById('wm-spell-selected');
        const existing = [...$sel.querySelectorAll('.wm-spell-chip')].map(c => c.dataset.id);
        if (existing.includes(spell.id)) return;
        addWmSpellChip($sel, { id: spell.id, name: spell.name, uses: 1, usesLeft: 1, recovery: 'Repos long' });
        document.getElementById('wm-spell-search').value = '';
        document.getElementById('wm-spell-results').innerHTML = '';
      });
      $r.appendChild(item);
    });
  }

  function addWmSpellChip($container, sp) {
    const chip = document.createElement('div');
    chip.className = 'wm-spell-chip';
    chip.dataset.id = sp.id;
    chip.innerHTML =
      '<span class="wm-chip-name">' + sp.name + '</span>' +
      '<div class="wm-chip-controls">' +
        '<label>Utilisations</label>' +
        '<input type="number" class="wm-chip-uses" min="1" value="' + (sp.uses || 1) + '">' +
        '<label>Récupération</label>' +
        '<select class="wm-chip-recovery">' +
          RECOVERY_OPTIONS.map(r => '<option value="' + r + '"' + (r === sp.recovery ? ' selected' : '') + '>' + r + '</option>').join('') +
        '</select>' +
      '</div>' +
      '<button class="btn-wm-del-spell">✕</button>';
    chip.querySelector('.btn-wm-del-spell').addEventListener('click', () => chip.remove());
    $container.appendChild(chip);
  }

  function renderWmSpellSelected(spells) {
    const $sel = document.getElementById('wm-spell-selected');
    $sel.innerHTML = '';
    spells.forEach(sp => addWmSpellChip($sel, sp));
  }

  document.getElementById('wm-spell-search').addEventListener('input', (e) => renderWmSpellResults(e.target.value));

  // Confirmation
  document.getElementById('btn-wm-confirm').addEventListener('click', () => {
    const name = document.getElementById('wm-name').value.trim();
    if (!name) { document.getElementById('wm-name').focus(); return; }

    const type       = document.getElementById('wm-type-selected').dataset.value || '';
    const hands      = document.getElementById('wm-hands').value;
    const atkBonus   = document.getElementById('wm-atk-bonus').value;
    const desc       = document.getElementById('wm-desc').value.trim();
    const properties = [...document.querySelectorAll('#wm-properties input:checked')].map(cb => cb.value);

    // Dégâts bonus
    const $dmgRows = document.getElementById('wm-dmg-rows');
    const damageBonus = [...$dmgRows.querySelectorAll('.wm-dmg-row')].map(row => ({
      type:   row.querySelector('.wm-dmg-type').value,
      amount: row.querySelector('.wm-dmg-amount').value.trim(),
    })).filter(d => d.amount);

    // Sorts
    const spells = [...document.getElementById('wm-spell-selected').querySelectorAll('.wm-spell-chip')].map(chip => ({
      id:       chip.dataset.id,
      name:     chip.querySelector('.wm-chip-name').textContent,
      uses:     parseInt(chip.querySelector('.wm-chip-uses').value, 10) || 1,
      usesLeft: parseInt(chip.querySelector('.wm-chip-uses').value, 10) || 1,
      recovery: chip.querySelector('.wm-chip-recovery').value,
    }));

    const equipped = weaponEditIndex !== null ? (character.inventoryWeapons[weaponEditIndex].equipped || false) : false;
    const weapon = { name, type, hands, atkBonus, damageBonus, properties, spells, desc, equipped };

    if (!character.inventoryWeapons) character.inventoryWeapons = [];
    if (weaponEditIndex !== null) {
      weapon.spells = spells.map((s, si) => ({ ...s, usesLeft: character.inventoryWeapons[weaponEditIndex].spells?.[si]?.usesLeft ?? s.uses }));
      character.inventoryWeapons[weaponEditIndex] = weapon;
    } else {
      character.inventoryWeapons.push(weapon);
    }
    saveCharacter();
    renderInventaire();
    document.getElementById('weapon-inv-modal').classList.add('hidden');
  });

  document.getElementById('btn-wm-cancel').addEventListener('click', () => {
    document.getElementById('weapon-inv-modal').classList.add('hidden');
  });

  // Weapon detail
  function openWeaponDetail(i) {
    const w = character.inventoryWeapons[i];
    document.getElementById('wd-name').textContent = w.name;

    let meta = '';
    if (w.type)     meta += '<span class="weapon-inv-type">'  + w.type    + '</span> ';
    if (w.atkBonus) meta += '<span class="weapon-inv-bonus">' + w.atkBonus + ' att./dégâts</span>';
    document.getElementById('wd-meta').innerHTML = meta;

    let dmg = '';
    if (w.damageBonus && w.damageBonus.length) {
      dmg = '<div class="wd-section-title">Dégâts bonus</div>' +
        w.damageBonus.map(d => '<span class="wd-dmg-tag">' + d.amount + ' ' + d.type + '</span>').join('');
    }
    document.getElementById('wd-dmg').innerHTML = dmg;

    let spellsHtml = '';
    if (w.spells && w.spells.length) {
      spellsHtml = '<div class="wd-section-title">Sorts associés</div>' +
        w.spells.map((s, si) =>
          '<div class="wd-spell-row">' +
            '<span class="wd-spell-name">✨ ' + s.name + '</span>' +
            '<div class="wd-spell-uses">' +
              '<button class="btn-spell-use" data-wi="' + i + '" data-si="' + si + '" data-d="-1">−</button>' +
              '<span class="wd-uses-left">' + (s.usesLeft ?? s.uses) + ' / ' + s.uses + '</span>' +
              '<button class="btn-spell-use" data-wi="' + i + '" data-si="' + si + '" data-d="1">+</button>' +
              '<span class="wd-recovery">(' + s.recovery + ')</span>' +
            '</div>' +
          '</div>'
        ).join('');
    }
    document.getElementById('wd-spells').innerHTML = spellsHtml;
    document.getElementById('wd-spells').querySelectorAll('.btn-spell-use').forEach(btn => {
      btn.addEventListener('click', () => {
        const wi = parseInt(btn.dataset.wi, 10);
        const si = parseInt(btn.dataset.si, 10);
        const sp = character.inventoryWeapons[wi].spells[si];
        sp.usesLeft = Math.max(0, Math.min(sp.uses, (sp.usesLeft ?? sp.uses) + parseInt(btn.dataset.d, 10)));
        saveCharacter();
        openWeaponDetail(wi);
      });
    });

    document.getElementById('wd-desc').textContent = w.desc || '';
    document.getElementById('btn-wd-edit').onclick = () => {
      document.getElementById('weapon-inv-detail-modal').classList.add('hidden');
      openWeaponModal(i);
    };
    document.getElementById('btn-wd-delete').onclick = () => {
      character.inventoryWeapons.splice(i, 1);
      saveCharacter();
      renderInventaire();
      document.getElementById('weapon-inv-detail-modal').classList.add('hidden');
    };
    document.getElementById('weapon-inv-detail-modal').classList.remove('hidden');
  }

  document.getElementById('scrolls-header').addEventListener('click', () => {
    scrollsCollapsed = !scrollsCollapsed;
    renderInventaire();
  });

  // --- Scroll modal ---
  let scrollLevelFilter = '';

  function openScrollModal() {
    scrollLevelFilter = '';
    document.getElementById('scroll-search').value = '';
    renderScrollFilters();
    renderScrollList();
    document.getElementById('scroll-modal').classList.remove('hidden');
  }

  const SCROLL_LEVELS = ['Tous', 'Cantrip', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  function renderScrollFilters() {
    const $f = document.getElementById('scroll-filters');
    $f.innerHTML = '';
    SCROLL_LEVELS.forEach(lvl => {
      const btn = document.createElement('button');
      btn.className = 'potion-filter-btn' + (lvl === (scrollLevelFilter || 'Tous') ? ' active' : '');
      btn.textContent = lvl;
      btn.addEventListener('click', () => {
        scrollLevelFilter = lvl === 'Tous' ? '' : (lvl === 'Cantrip' ? '0' : lvl);
        renderScrollFilters();
        renderScrollList();
      });
      $f.appendChild(btn);
    });
  }

  async function renderScrollList() {
    const $list = document.getElementById('scroll-spell-list');
    $list.innerHTML = '';
    const search = document.getElementById('scroll-search').value.toLowerCase();
    const spells = await fetchAllSpells();
    const filtered = spells.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search);
      const matchLevel  = scrollLevelFilter === '' || String(s.level) === scrollLevelFilter;
      return matchSearch && matchLevel;
    });

    if (filtered.length === 0) {
      $list.innerHTML = '<p class="potion-empty">Aucun sort trouvé.</p>';
      return;
    }

    filtered.slice(0, 40).forEach(spell => {
      const row = document.createElement('div');
      row.className = 'potion-row';
      const lvlLabel = spell.level === 0 ? 'Cantrip' : 'Niv. ' + spell.level;
      row.innerHTML =
        '<div class="potion-info">' +
          '<span class="potion-name">📜 ' + spell.name + '</span>' +
          '<span class="potion-desc">' + lvlLabel + (spell.school ? ' · ' + spell.school : '') + '</span>' +
        '</div>' +
        '<div class="potion-add-ctrl">' +
          '<button class="btn-qty-p" data-d="-1">−</button>' +
          '<span class="potion-qty">1</span>' +
          '<button class="btn-qty-p" data-d="1">+</button>' +
          '<button class="btn-potion-add">Ajouter</button>' +
        '</div>';

      const qtyEl = row.querySelector('.potion-qty');
      row.querySelectorAll('.btn-qty-p').forEach(btn => {
        btn.addEventListener('click', () => {
          let q = parseInt(qtyEl.textContent, 10) + parseInt(btn.dataset.d, 10);
          if (q < 1) q = 1;
          qtyEl.textContent = q;
        });
      });
      row.querySelector('.btn-potion-add').addEventListener('click', () => {
        if (!character.spellScrolls) character.spellScrolls = [];
        character.spellScrolls.push({ id: spell.id, name: spell.name, level: spell.level, qty: parseInt(qtyEl.textContent, 10) });
        saveCharacter();
        renderInventaire();
        document.getElementById('scroll-modal').classList.add('hidden');
      });
      $list.appendChild(row);
    });
  }

  document.getElementById('scroll-search').addEventListener('input', renderScrollList);

  document.getElementById('consommables-header').addEventListener('click', () => {
    consumablesCollapsed = !consumablesCollapsed;
    renderInventaire();
  });

  document.getElementById('quetes-header').addEventListener('click', () => {
    questCollapsed = !questCollapsed;
    renderInventaire();
  });

  // --- Quest modals ---
  function openQuestAddModal() {
    document.getElementById('quest-name-input').value = '';
    document.getElementById('quest-desc-input').value = '';
    document.getElementById('quest-add-modal').classList.remove('hidden');
    document.getElementById('quest-name-input').focus();
  }

  document.getElementById('btn-quest-confirm').addEventListener('click', () => {
    const name = document.getElementById('quest-name-input').value.trim();
    if (!name) return;
    const desc = document.getElementById('quest-desc-input').value.trim();
    if (!character.questItems) character.questItems = [];
    character.questItems.push({ name, desc });
    saveCharacter();
    renderInventaire();
    document.getElementById('quest-add-modal').classList.add('hidden');
  });

  function openQuestDetail(i) {
    showQuestViewMode(i);
    document.getElementById('quest-detail-modal').classList.remove('hidden');
  }

  function showQuestViewMode(i) {
    const item = character.questItems[i];
    document.getElementById('quest-view-mode').classList.remove('hidden');
    document.getElementById('quest-edit-mode').classList.add('hidden');
    document.getElementById('quest-detail-name').textContent = item.name;
    document.getElementById('quest-detail-desc').textContent = item.desc || 'Aucune description.';

    document.getElementById('btn-quest-edit').onclick = () => showQuestEditMode(i);

    document.getElementById('btn-quest-delete').onclick = () => {
      character.questItems.splice(i, 1);
      saveCharacter();
      renderInventaire();
      document.getElementById('quest-detail-modal').classList.add('hidden');
    };
  }

  function showQuestEditMode(i) {
    const item = character.questItems[i];
    document.getElementById('quest-view-mode').classList.add('hidden');
    document.getElementById('quest-edit-mode').classList.remove('hidden');
    document.getElementById('quest-edit-name').value = item.name;
    document.getElementById('quest-edit-desc').value = item.desc || '';
    document.getElementById('quest-edit-name').focus();

    document.getElementById('btn-quest-save').onclick = () => {
      const newName = document.getElementById('quest-edit-name').value.trim();
      if (!newName) return;
      character.questItems[i].name = newName;
      character.questItems[i].desc = document.getElementById('quest-edit-desc').value.trim();
      saveCharacter();
      renderInventaire();
      showQuestViewMode(i);
    };

    document.getElementById('btn-quest-cancel').onclick = () => showQuestViewMode(i);
  }

  // Portrait URL toggle
  document.getElementById('btn-portrait-toggle').addEventListener('click', () => {
    const row = document.getElementById('portrait-url-row');
    row.classList.toggle('hidden');
    if (!row.classList.contains('hidden')) {
      const input = document.getElementById('portrait-url-input');
      input.value = character.portrait || '';
      input.focus();
    }
  });

  document.getElementById('portrait-url-input').addEventListener('change', (e) => {
    character.portrait = e.target.value.trim();
    saveCharacter();
    renderInventaire();
    document.getElementById('portrait-url-row').classList.add('hidden');
  });

  // --- Level Up ---
  $btnLevelUp.addEventListener('click', startLevelUp);

  async function startLevelUp() {
    const newLevel = character.level + 1;
    let progression = null;

    if (character.class) {
      const res = await apiFetch('/api/progression/' + encodeURIComponent(character.class.toLowerCase()) + '/' + newLevel);
      if (res.ok) progression = await res.json();
    }

    let html = '<h2>Monter au niveau ' + newLevel + '</h2>';

    // Step 1 — Auto changes preview
    html += '<div class="levelup-step"><h3>Changements automatiques</h3><ul>';
    if (progression) {
      html += '<li>Bonus de maîtrise : +' + progression.proficiencyBonus + '</li>';
      html += '<li>Emplacements de sorts : ' + JSON.stringify(progression.spellSlots || {}) + '</li>';
      if (progression.features && progression.features.length > 0) {
        html += '<li>Nouvelles capacités : ' + progression.features.join(', ') + '</li>';
      }
    }
    html += '<li>Dé de vie : +1d' + (progression ? progression.hitDie : '?') + '</li>';
    html += '</ul></div>';

    // Step 2 — HP increase
    const conMod = mod(character.stats.constitution);
    html += '<div class="levelup-step"><h3>Augmentation des PV</h3>';
    html += '<p>Dé de vie : d' + (progression ? progression.hitDie : '?') + ' (mod CON : ' + (conMod >= 0 ? '+' : '') + conMod + ')</p>';
    html += '<div class="levelup-input">';
    html += '<label>Résultat du jet (ou moyenne) :</label>';
    html += '<input type="number" id="levelup-hp-roll" min="1" max="' + (progression ? progression.hitDie : 12) + '" value="' + Math.ceil((progression ? progression.hitDie : 8) / 2 + 1) + '">';
    html += '</div></div>';

    // Step 3 — Ability Score Improvement
    if (progression && progression.choices && progression.choices.abilityScoreImprovement) {
      html += '<div class="levelup-step"><h3>Amélioration de caractéristique</h3>';
      html += '<p>+2 à une caractéristique ou +1 à deux caractéristiques</p>';
      html += '<div class="levelup-input">';
      html += '<select id="levelup-asi-1"><option value="">Choisir...</option>';
      for (const [key, label] of Object.entries(STATS)) {
        html += '<option value="' + key + '">' + label + ' (' + character.stats[key] + ')</option>';
      }
      html += '</select>';
      html += '<select id="levelup-asi-2"><option value="">Aucune (2e)</option>';
      for (const [key, label] of Object.entries(STATS)) {
        html += '<option value="' + key + '">' + label + ' (' + character.stats[key] + ')</option>';
      }
      html += '</select>';
      html += '<p style="font-size:0.75rem;color:var(--text-dim)">1 stat = +2, 2 stats = +1 chacune</p>';
      html += '</div></div>';
    }

    // Confirm
    html += '<button class="btn-primary" id="btn-confirm-levelup">Confirmer la montée de niveau</button>';

    $levelupContent.innerHTML = html;
    $levelupModal.classList.remove('hidden');

    document.getElementById('btn-confirm-levelup').addEventListener('click', () => {
      applyLevelUp(newLevel, progression);
    });
  }

  function applyLevelUp(newLevel, progression) {
    // Level
    character.level = newLevel;

    // Proficiency & spell slots
    if (progression) {
      character.proficiencyBonus = progression.proficiencyBonus;
      character.spellSlots = progression.spellSlots || character.spellSlots;

      // New features
      if (progression.features) {
        if (!character.classFeatures) character.classFeatures = [];
        for (const f of progression.features) {
          if (!character.classFeatures.includes(f)) character.classFeatures.push(f);
        }
      }
    }

    // HP
    const hpRoll = parseInt(document.getElementById('levelup-hp-roll').value, 10) || 1;
    const conMod = mod(character.stats.constitution);
    const hpGain = Math.max(1, hpRoll + conMod);
    character.hp.max += hpGain;
    character.hp.current += hpGain;

    // ASI
    const asi1El = document.getElementById('levelup-asi-1');
    const asi2El = document.getElementById('levelup-asi-2');
    if (asi1El && asi1El.value) {
      const asi2 = asi2El ? asi2El.value : '';
      if (asi2) {
        character.stats[asi1El.value] = (character.stats[asi1El.value] || 10) + 1;
        character.stats[asi2] = (character.stats[asi2] || 10) + 1;
      } else {
        character.stats[asi1El.value] = (character.stats[asi1El.value] || 10) + 2;
      }
    }

    saveCharacter();
    $levelupModal.classList.add('hidden');
    spellsCache = null;
    renderAll();
  }

  // --- Modal close ---
  document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.add('hidden');
    });
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });

  // --- Init ---
  loadApp(); // Auth temporairement désactivée — TODO: remettre la vérification du token
})();
