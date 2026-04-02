const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.aidedd.org';
const LIST_URL = BASE_URL + '/dnd-filters/sorts.php';
const DETAIL_URL = BASE_URL + '/dnd/sorts.php';
const OUTPUT = path.join(__dirname, '..', 'data', 'spells.json');

const DELAY_MS = 300; // politesse entre les requêtes

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return res.text();
}

// --- Étape 1 : récupérer la liste de tous les sorts ---
async function getSpellList() {
  console.log('Récupération de la liste des sorts...');
  const html = await fetchPage(LIST_URL);
  const $ = cheerio.load(html);

  const spells = [];
  // Structure: td.nocel (checkbox) | td.item (lien nom VF) | td.colVF | td.colVO | td.center (niveau) | td.colE (école) | ...
  $('tbody tr').each((i, row) => {
    const cells = $(row).find('td');
    if (cells.length < 6) return;

    const link = $(cells).filter('.item').find('a');
    const href = link.attr('href') || '';
    const vfMatch = href.match(/[?&]vf=([^&]+)/);
    if (!vfMatch) return;

    spells.push({
      id: vfMatch[1],
      name: link.text().trim(),
      nameVO: $(cells).filter('.colVO').text().trim(),
      level: parseInt($(cells).filter('.center').text().trim(), 10) || 0,
      school: $(cells).filter('.colE').text().trim().toLowerCase(),
    });
  });

  console.log(`${spells.length} sorts trouvés dans la liste.`);
  return spells;
}

// --- Étape 2 : scraper le détail d'un sort ---
// Structure HTML de aidedd.org :
//   <div class='t'>  Temps d'incantation
//   <div class='r'>  Portée
//   <div class='c'>  Composantes
//   <div class='d'>  Durée
//   <div class='description'>  Description (avec <br> et potentiellement "Aux niveaux supérieurs")
//   <div class='classe'>  Une div par classe
async function getSpellDetail(spellId) {
  const url = DETAIL_URL + '?vf=' + spellId;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const getText = (sel) => {
    const el = $(sel).first();
    if (!el.length) return '';
    // Retirer le label <strong> pour ne garder que la valeur
    const clone = el.clone();
    clone.find('strong').remove();
    return clone.text().replace(/^\s*:\s*/, '').trim();
  };

  const castingTime = getText('div.t');
  const range = getText('div.r');
  const components = getText('div.c');
  const duration = getText('div.d');

  // Description : contenu de div.description, convertir <br> en \n
  const descEl = $('div.description');
  let descHtml = descEl.html() || '';
  // Remplacer <br> par \n
  descHtml = descHtml.replace(/<br\s*\/?>/gi, '\n');
  // Retirer les tags HTML restants sauf emphasis
  const descText = cheerio.load(descHtml).text().trim();

  // Séparer description et niveaux supérieurs
  let description = descText;
  let higherLevels = '';
  const higherMatch = descText.match(/aux?\s+niveaux?\s+sup[ée]rieurs?\.?\s*[.:]\s*([\s\S]*)/i);
  if (higherMatch) {
    description = descText.substring(0, higherMatch.index).trim();
    higherLevels = higherMatch[1].trim();
  }

  // Classes : chaque <div class='classe'> contient un nom de classe
  const classes = [];
  $('div.classe').each((_, el) => {
    const name = $(el).text().trim().toLowerCase();
    if (name) classes.push(name);
  });

  return {
    castingTime,
    range,
    components,
    duration,
    description,
    higherLevels,
    classes,
  };
}

// --- Main ---
async function main() {
  const spellList = await getSpellList();

  if (spellList.length === 0) {
    console.error('Aucun sort trouvé ! Vérifiez la structure de la page.');
    process.exit(1);
  }

  const results = [];
  let errors = 0;

  for (let i = 0; i < spellList.length; i++) {
    const spell = spellList[i];
    process.stdout.write(`\r[${i + 1}/${spellList.length}] ${spell.name}...`);

    try {
      const detail = await getSpellDetail(spell.id);
      results.push({
        id: spell.id,
        name: spell.name,
        nameVO: spell.nameVO,
        level: spell.level,
        school: spell.school,
        castingTime: detail.castingTime,
        range: detail.range,
        components: detail.components,
        duration: detail.duration,
        description: detail.description,
        higherLevels: detail.higherLevels,
        classes: detail.classes,
      });
    } catch (err) {
      console.error(`\nErreur pour ${spell.name}: ${err.message}`);
      errors++;
      // Ajouter quand même avec les infos de base
      results.push({
        id: spell.id,
        name: spell.name,
        nameVO: spell.nameVO,
        level: spell.level,
        school: spell.school,
        castingTime: '',
        range: '',
        components: '',
        duration: '',
        description: '',
        higherLevels: '',
        classes: [],
      });
    }

    await sleep(DELAY_MS);
  }

  // Trier par niveau puis par nom
  results.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'fr'));

  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n\nTerminé ! ${results.length} sorts sauvegardés dans data/spells.json`);
  if (errors > 0) console.log(`${errors} sorts avec erreurs (infos de base uniquement)`);
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
