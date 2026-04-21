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

  const XP_THRESHOLDS = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
  ];

  // --- State ---
  let character = null;
  let spellsCache = null;
  let saveTimeout = null;
  let editMode = false;

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
  function renderInventaire() {
    document.getElementById('gold-amount').textContent = character.gold || 0;

    document.querySelectorAll('[data-gold]').forEach((btn) => {
      btn.onclick = () => {
        const delta = parseInt(btn.dataset.gold, 10);
        character.gold = Math.max(0, (character.gold || 0) + delta);
        saveCharacter();
        renderInventaire();
      };
    });

    const $equip = document.getElementById('equipment-list');
    $equip.innerHTML = '';
    (character.equipment || []).forEach((item, i) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = item + ' <button class="btn-remove">&times;</button>';
      tag.querySelector('.btn-remove').addEventListener('click', () => {
        character.equipment.splice(i, 1);
        saveCharacter();
        renderInventaire();
      });
      $equip.appendChild(tag);
    });

    document.getElementById('btn-add-equip').onclick = () => {
      const input = document.getElementById('equip-input');
      if (!input.value.trim()) return;
      if (!character.equipment) character.equipment = [];
      character.equipment.push(input.value.trim());
      input.value = '';
      saveCharacter();
      renderInventaire();
    };
  }

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
