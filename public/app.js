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

  const SPELLCASTING_ABILITY = {
    'barde': 'charisma', 'clerc': 'wisdom', 'druide': 'wisdom',
    'magicien': 'intelligence', 'occultiste': 'charisma',
    'paladin': 'charisma', 'rodeur': 'wisdom', 'ensorceleur': 'charisma',
    'moine': 'wisdom',
  };

  const RACE_ALIASES = {
    'high elf': 'haute-elfe', 'wood elf': 'elfe des bois', 'drow': 'elfe noir',
    'elf': 'elfe', 'hill dwarf': 'nain des collines', 'mountain dwarf': 'nain des montagnes',
    'dwarf': 'nain', 'human': 'humain', 'lightfoot halfling': 'halfelin pied-léger',
    'stout halfling': 'halfelin robuste', 'halfling': 'halfelin',
    'rock gnome': 'gnome des roches', 'forest gnome': 'gnome des forêts',
    'half-elf': 'demi-elfe', 'half-orc': 'demi-orc',
    'tiefling': 'tieffelin', 'dragonborn': 'draconide',
  };

  // ---- Capacités de classe D&D 5e ----
  // t: 'auto' | 'choice' | 'multi' | 'asi' | 'multi-more'
  // id: clé pour classFeatureChoices (défaut = name)
  // opts: liste d'options (choice/multi)
  // count: nb de choix (multi)
  const CLASS_FEATURES = {
    'barbare': [
      { l:1,  name:'Rage',                             t:'auto' },
      { l:1,  name:'Défense sans armure',              t:'auto' },
      { l:2,  name:'Attaque téméraire',                t:'auto' },
      { l:2,  name:'Sens du danger',                   t:'auto' },
      { l:3,  name:'Voie primitive', id:'voie-primitive', t:'choice',
        opts:['Berserker','Totem guerrier','Âme ancestrale','Héraut de la tempête','Bête sauvage','Guerrier sauvage'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Attaque supplémentaire',           t:'auto' },
      { l:5,  name:'Mouvement rapide',                 t:'auto' },
      { l:6,  name:'Capacité de voie',                 t:'auto' },
      { l:7,  name:'Instinct sauvage',                 t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:9,  name:'Critique brutal (1 dé)',            t:'auto' },
      { l:10, name:'Capacité de voie',                 t:'auto' },
      { l:11, name:'Rage inébranlable',                t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:13, name:'Critique brutal (2 dés)',           t:'auto' },
      { l:14, name:'Capacité de voie',                 t:'auto' },
      { l:15, name:'Rage persistante',                 t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:17, name:'Critique brutal (3 dés)',           t:'auto' },
      { l:18, name:'Puissance indomptable',            t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Champion primitif',                t:'auto' },
    ],
    'barde': [
      { l:1,  name:'Sorts de bardes',                  t:'auto' },
      { l:1,  name:'Inspiration bardique (d6)',         t:'auto' },
      { l:2,  name:'Touche-à-tout',                    t:'auto' },
      { l:2,  name:'Chant reposant',                   t:'auto' },
      { l:3,  name:'Collège bardique', id:'college-bardique', t:'choice',
        opts:['Collège du savoir','Collège de la vaillance','Collège du glamour','Collège des épées','Collège des chuchotements'] },
      { l:3,  name:'Expertise',                        t:'auto' },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Source d\'inspiration',            t:'auto' },
      { l:5,  name:'Contre-charme',                    t:'auto' },
      { l:6,  name:'Capacité de collège',              t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:10, name:'Expertise supplémentaire',         t:'auto' },
      { l:10, name:'Secrets magiques',                 t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Capacité de collège',              t:'auto' },
      { l:14, name:'Secrets magiques supplémentaires', t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:18, name:'Secrets magiques suprêmes',        t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Inspiration supérieure',           t:'auto' },
    ],
    'clerc': [
      { l:1,  name:'Domaine divin', id:'domaine-divin', t:'choice',
        opts:['Connaissance','Forge','Guerre','Lumière','Nature','Ordre','Paix','Tempête','Tombale','Tromperie','Vie'] },
      { l:1,  name:'Sorts de domaine',                 t:'auto' },
      { l:2,  name:'Canalisation divine',              t:'auto' },
      { l:2,  name:'Capacité de domaine',              t:'auto' },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Destruction des morts-vivants',    t:'auto' },
      { l:6,  name:'Canalisation divine (2/repos)',    t:'auto' },
      { l:6,  name:'Capacité de domaine',              t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:8,  name:'Capacité de domaine',              t:'auto' },
      { l:10, name:'Intervention divine',              t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Destruction des morts-vivants (améliorée)', t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:18, name:'Canalisation divine (3/repos)',    t:'auto' },
      { l:18, name:'Capacité de domaine',              t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Intervention divine suprême',      t:'auto' },
    ],
    'druide': [
      { l:1,  name:'Druidique',                        t:'auto' },
      { l:1,  name:'Sorts de druide',                  t:'auto' },
      { l:2,  name:'Forme sauvage',                    t:'auto' },
      { l:2,  name:'Cercle druidique', id:'cercle-druidique', t:'choice',
        opts:['Cercle de la lune','Cercle de la terre','Cercle du berger','Cercle du rêve','Cercle des spores','Cercle des étoiles'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:4,  name:'Forme sauvage améliorée',          t:'auto' },
      { l:6,  name:'Capacité de cercle',               t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:8,  name:'Forme sauvage : bête élémentaire', t:'auto' },
      { l:10, name:'Capacité de cercle',               t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Capacité de cercle',               t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:18, name:'Corps immortel',                   t:'auto' },
      { l:18, name:'Sorts de bête',                    t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Archidruide',                      t:'auto' },
    ],
    'guerrier': [
      { l:1,  name:'Second souffle',                   t:'auto' },
      { l:1,  name:'Style de combat', id:'style-combat', t:'choice',
        opts:['Archerie','Combat à deux armes','Défense','Duel','Protection','Supériorité à la lutte'] },
      { l:2,  name:'Fougue (1)',                       t:'auto' },
      { l:3,  name:'Archétype martial', id:'archetyp-martial', t:'choice',
        opts:['Archer arcanique','Cavalier','Champion','Chevalier eldritch','Chevalier pourpre','Maître des batailles','Samouraï'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Attaque supplémentaire (×2)',      t:'auto' },
      { l:6,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:7,  name:'Capacité d\'archétype',            t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:9,  name:'Indomptable (1)',                  t:'auto' },
      { l:10, name:'Capacité d\'archétype',            t:'auto' },
      { l:11, name:'Attaque supplémentaire (×3)',      t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:13, name:'Indomptable (2)',                  t:'auto' },
      { l:14, name:'Amélioration de caractéristique',  t:'asi' },
      { l:15, name:'Capacité d\'archétype',            t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:17, name:'Fougue (2), Indomptable (3)',      t:'auto' },
      { l:18, name:'Capacité d\'archétype',            t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Attaque supplémentaire (×4)',      t:'auto' },
    ],
    'moine': [
      { l:1,  name:'Arts martiaux',                    t:'auto' },
      { l:1,  name:'Défense sans armure',              t:'auto' },
      { l:2,  name:'Ki',                               t:'auto' },
      { l:2,  name:'Déplacement sans armure (+10 pi)', t:'auto' },
      { l:3,  name:'Tradition monastique', id:'tradition-monastique', t:'choice',
        opts:['Voie de la faucheuse','Voie de la miséricorde','Voie des cinq éléments','Voie du poing ouvert','Voie du soleil','Voie de l\'ombre'] },
      { l:3,  name:'Parade de projectiles',            t:'auto' },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:4,  name:'Chute ralentie',                   t:'auto' },
      { l:5,  name:'Attaque supplémentaire',           t:'auto' },
      { l:5,  name:'Frappe étourdissante',             t:'auto' },
      { l:6,  name:'Frappes ki (magiques)',            t:'auto' },
      { l:6,  name:'Capacité de tradition',            t:'auto' },
      { l:7,  name:'Tranquillité',                     t:'auto' },
      { l:7,  name:'Langue du soleil et de la lune',   t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:9,  name:'Déplacement sans armure (+15 pi)', t:'auto' },
      { l:10, name:'Pureté du corps',                  t:'auto' },
      { l:11, name:'Capacité de tradition',            t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Âme de diamant',                   t:'auto' },
      { l:15, name:'Corps immortel',                   t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:17, name:'Capacité de tradition',            t:'auto' },
      { l:18, name:'Moi vide',                         t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Perfection de soi',                t:'auto' },
    ],
    'paladin': [
      { l:1,  name:'Détection du mal et du bien',      t:'auto' },
      { l:1,  name:'Imposition des mains',             t:'auto' },
      { l:2,  name:'Style de combat', id:'style-combat', t:'choice',
        opts:['Arme à deux mains','Défense','Duel','Protection'] },
      { l:2,  name:'Sorts',                            t:'auto' },
      { l:2,  name:'Châtiment divin',                  t:'auto' },
      { l:3,  name:'Santé divine',                     t:'auto' },
      { l:3,  name:'Serment sacré', id:'serment-sacre', t:'choice',
        opts:['Serment de conquête','Serment de dévotion','Serment de gloire','Serment de rédemption','Serment de vengeance','Serment des anciens'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Attaque supplémentaire',           t:'auto' },
      { l:6,  name:'Aura de protection',               t:'auto' },
      { l:7,  name:'Capacité de serment',              t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:10, name:'Aura de courage',                  t:'auto' },
      { l:11, name:'Châtiment divin amélioré',         t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Purification des maladies',        t:'auto' },
      { l:15, name:'Capacité de serment',              t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:18, name:'Aura améliorée',                   t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Capacité de serment suprême',      t:'auto' },
    ],
    'rodeur': [
      { l:1,  name:'Ennemi juré', id:'ennemi-jure-1', t:'choice',
        opts:['Aberrations','Bêtes','Célestes','Constructions','Dragons','Élémentaires','Fées','Fiélons','Géants','Humanoïdes','Monstruosités','Morts-vivants','Plantes','Vases'] },
      { l:1,  name:'Explorateur-né', id:'explorateur-1', t:'choice',
        opts:['Arctique','Côte','Désert','Forêt','Marécage','Montagne','Plaine','Souterrain'] },
      { l:2,  name:'Style de combat', id:'style-combat', t:'choice',
        opts:['Archerie','Combat à deux armes','Défense','Duel'] },
      { l:3,  name:'Sorts de rôdeur',                  t:'auto' },
      { l:3,  name:'Conscience primitive',             t:'auto' },
      { l:3,  name:'Archétype de rôdeur', id:'archetyp-rodeur', t:'choice',
        opts:['Chasseur','Erreur glauque','Horizon','Maître des bêtes','Tueur de monstres'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Attaque supplémentaire',           t:'auto' },
      { l:6,  name:'Ennemi juré supplémentaire', id:'ennemi-jure-2', t:'choice',
        opts:['Aberrations','Bêtes','Célestes','Constructions','Dragons','Élémentaires','Fées','Fiélons','Géants','Humanoïdes','Monstruosités','Morts-vivants','Plantes','Vases'] },
      { l:6,  name:'Explorateur-né supplémentaire', id:'explorateur-2', t:'choice',
        opts:['Arctique','Côte','Désert','Forêt','Marécage','Montagne','Plaine','Souterrain'] },
      { l:7,  name:'Capacité d\'archétype',            t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:8,  name:'Traversée des terres',             t:'auto' },
      { l:10, name:'Camouflage naturel',               t:'auto' },
      { l:10, name:'Explorateur-né supplémentaire', id:'explorateur-3', t:'choice',
        opts:['Arctique','Côte','Désert','Forêt','Marécage','Montagne','Plaine','Souterrain'] },
      { l:11, name:'Capacité d\'archétype',            t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Disparition',                      t:'auto' },
      { l:14, name:'Ennemi juré suprême', id:'ennemi-jure-3', t:'choice',
        opts:['Aberrations','Bêtes','Célestes','Constructions','Dragons','Élémentaires','Fées','Fiélons','Géants','Humanoïdes','Monstruosités','Morts-vivants','Plantes','Vases'] },
      { l:15, name:'Capacité d\'archétype',            t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:18, name:'Sens sauvages',                    t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Tueur ennemi',                     t:'auto' },
    ],
    'roublard': [
      { l:1,  name:'Attaque sournoise',                t:'auto' },
      { l:1,  name:'Argot des voleurs',                t:'auto' },
      { l:1,  name:'Expertise',                        t:'auto' },
      { l:2,  name:'Action astucieuse',                t:'auto' },
      { l:3,  name:'Archétype de roublard', id:'archetyp-roublard', t:'choice',
        opts:['Âme volée','Assassin','Détective','Escroc','Esprit arcanique','Fantôme','Maître des couteaux'] },
      { l:3,  name:'Esquive instinctive',              t:'auto' },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:5,  name:'Esquive instinctive améliorée',    t:'auto' },
      { l:6,  name:'Expertise supplémentaire',         t:'auto' },
      { l:7,  name:'Esquive totale',                   t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:9,  name:'Capacité d\'archétype',            t:'auto' },
      { l:10, name:'Amélioration de caractéristique',  t:'asi' },
      { l:11, name:'Talent fiable',                    t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:13, name:'Capacité d\'archétype',            t:'auto' },
      { l:14, name:'Sens des angles morts',            t:'auto' },
      { l:15, name:'Esprit glissant',                  t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:17, name:'Capacité d\'archétype',            t:'auto' },
      { l:18, name:'Insaisissable',                    t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Coup de chance',                   t:'auto' },
    ],
    'ensorceleur': [
      { l:1,  name:'Origine sorcière', id:'origine-sorciere', t:'choice',
        opts:['Distorsion de la réalité','Héritage draconique','Magie de feu','Magie sauvage','Ombres divines','Tempête','Âme mécanique'] },
      { l:2,  name:'Source de magie',                  t:'auto' },
      { l:3,  name:'Métamagie', id:'metamagie', t:'multi', count:2,
        opts:['Sorts accélérés','Sorts amplifiés','Sorts distants','Sorts étendus','Sorts hautains','Sorts jumeaux','Sorts prudents','Sorts subtils'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:6,  name:'Capacité d\'origine',              t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:10, name:'Métamagie supplémentaire', id:'metamagie', t:'multi-more', count:1 },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Capacité d\'origine',              t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:17, name:'Métamagie supplémentaire', id:'metamagie', t:'multi-more', count:1 },
      { l:18, name:'Capacité d\'origine',              t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Restauration sorcière',            t:'auto' },
    ],
    'occultiste': [
      { l:1,  name:'Magie du pacte',                   t:'auto' },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:6,  name:'Capacité de protecteur',           t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:10, name:'Capacité de protecteur',           t:'auto' },
      { l:11, name:'Invocation mystique',              t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Capacité de protecteur',           t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Maître de l\'au-delà',             t:'auto' },
    ],
    'magicien': [
      { l:1,  name:'Récupération arcanique',           t:'auto' },
      { l:2,  name:'Tradition arcanique', id:'tradition-arcanique', t:'choice',
        opts:['Chronurgie','Graviturgie','Magie de guerre','École d\'abjuration','École d\'enchantement','École d\'évocation','École d\'illusion','École d\'invocation','École de divination','École de nécromancie','École de transmutation'] },
      { l:4,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:6,  name:'Capacité de tradition',            t:'auto' },
      { l:8,  name:'Amélioration de caractéristique',  t:'asi' },
      { l:10, name:'Capacité de tradition',            t:'auto' },
      { l:12, name:'Amélioration de caractéristique',  t:'asi' },
      { l:14, name:'Capacité de tradition',            t:'auto' },
      { l:16, name:'Amélioration de caractéristique',  t:'asi' },
      { l:18, name:'Maîtrise des sorts',               t:'auto' },
      { l:19, name:'Amélioration de caractéristique',  t:'asi' },
      { l:20, name:'Sorts de légende',                 t:'auto' },
    ],
  };

  const CLASS_KEY_MAP = {
    'barbare': 'barbare', 'barbarian': 'barbare',
    'barde': 'barde', 'bard': 'barde',
    'clerc': 'clerc', 'cleric': 'clerc',
    'druide': 'druide', 'druid': 'druide',
    'guerrier': 'guerrier', 'fighter': 'guerrier',
    'moine': 'moine', 'monk': 'moine',
    'paladin': 'paladin',
    'rôdeur': 'rodeur', 'rodeur': 'rodeur', 'ranger': 'rodeur',
    'roublard': 'roublard', 'rogue': 'roublard',
    'ensorceleur': 'ensorceleur', 'ensorceuse': 'ensorceleur', 'sorcerer': 'ensorceleur',
    'sorcier': 'ensorceleur', 'sorcière': 'ensorceleur',
    'occultiste': 'occultiste', 'warlock': 'occultiste',
    'magicien': 'magicien', 'magicienne': 'magicien', 'wizard': 'magicien',
  };

  const CF_DESCS = {
    'voie-primitive': {
      desc: 'Tradition barbare qui donne accès à des capacités supplémentaires lors de la rage.',
      opts: {
        'Berserker':             'Rage frénétique — attaque bonus, résistance au charme et à la peur.',
        'Totem guerrier':        'Connexion spirituelle (ours, aigle, loup) avec pouvoirs distincts.',
        'Âme ancestrale':        'Manifestation d\'ancêtres qui protègent et guident au combat.',
        'Héraut de la tempête':  'Aura élémentaire lors de la rage : tonnerre ou froid au choix.',
        'Bête sauvage':          'Mutations physiques bestiales (griffes, peau épaisse, crocs).',
        'Guerrier sauvage':      'Accès à des tours de magie et sorts innés liés à la nature.',
      },
    },
    'college-bardique': {
      desc: 'Collège qui oriente votre art et vos capacités de bardique spécialisées.',
      opts: {
        'Collège du savoir':         'Maîtrises supplémentaires, secrets magiques élargis, critique raté ennemi.',
        'Collège de la vaillance':   'Armures intermédiaires, armes de guerre, inspiration au combat.',
        'Collège du glamour':        'Inspiration de masse, aura féérique, manteau d\'inspiration.',
        'Collège des épées':         'Manœuvres de lame avec l\'inspiration bardique, style de combat.',
        'Collège des chuchotements': 'Mots psychiques, ombre mimétique, don des murmures.',
      },
    },
    'domaine-divin': {
      desc: 'Domaine accordé par votre divinité — détermine sorts supplémentaires et capacités.',
      opts: {
        'Connaissance': 'Maîtrise de langues, sorts de divination, lecture des esprits.',
        'Forge':        'Armes et armures bénites, bonus aux objets forgés.',
        'Guerre':       'Attaques guidées, capacités martiales renforcées.',
        'Lumière':      'Sorts radieux offensifs, aura lumineuse, pilier de lumière.',
        'Nature':       'Connexion animale, sorts de druide, résistances naturelles.',
        'Ordre':        'Commandement vocal, sorts de loi, punition divine.',
        'Paix':         'Liens spirituels entre alliés, sorts de soutien amplifiés.',
        'Tempête':      'Magie du tonnerre et de la foudre, déplacements aériens.',
        'Tombale':      'Protection contre la mort, soins des mourants, résistance nécrotique.',
        'Tromperie':    'Illusions et déguisements, sorts de trickster.',
        'Vie':          'Sorts de soin amplifiés, stabilisation des mourants.',
      },
    },
    'cercle-druidique': {
      desc: 'Ordre de druides auquel vous appartenez, orientant vos connexions et pouvoirs.',
      opts: {
        'Cercle de la lune':    'Formes sauvages puissantes (élémentaires, challenges élevés).',
        'Cercle de la terre':   'Sorts supplémentaires selon le terrain naturel choisi.',
        'Cercle du berger':     'Invocations renforcées, totem de berger, communication animale.',
        'Cercle du rêve':       'Soins féérique, déplacement dans le Féerond.',
        'Cercle des spores':    'Spores de champignon, zombies fongiques, prolifération.',
        'Cercle des étoiles':   'Cartographie céleste, formes constellées, prophéties.',
      },
    },
    'style-combat': {
      desc: 'Spécialité de combat qui confère un bonus passif permanent.',
      opts: {
        'Archerie':                    '+2 aux jets d\'attaque avec les armes à distance.',
        'Arme à deux mains':           '+2 aux jets de dégâts avec les armes à deux mains.',
        'Combat à deux armes':         'Ajoutez le modificateur de caractéristique aux dégâts de l\'attaque hors-directrice.',
        'Défense':                     '+1 à la CA tant que vous portez une armure.',
        'Duel':                        '+2 aux dégâts quand vous maniez une arme à une main sans autre arme.',
        'Protection':                  'Imposez désavantage aux attaques ennemies contre un allié adjacent (nécessite bouclier).',
        'Supériorité à la lutte':      'Avantage sur les tentatives de lutte et d\'agripper.',
      },
    },
    'archetyp-martial': {
      desc: 'Voie de spécialisation du guerrier qui détermine ses capacités avancées.',
      opts: {
        'Archer arcanique':    'Flèches magiques à effets variés, sorts de guidage en attaque.',
        'Cavalier':            'Lien avec une monture magique, protection et attaques conjointes.',
        'Champion':            'Critique sur 19-20, athlète remarquable, style de combat supplémentaire.',
        'Chevalier eldritch':  'Accès aux sorts des écoles d\'abjuration et d\'évocation.',
        'Chevalier pourpre':   'Inspiration d\'alliés, manœuvres de ralliement, aura de bravoure.',
        'Maître des batailles':'Manœuvres tactiques avec dés de supériorité, versatilité martiale.',
        'Samouraï':            'Regain d\'avantage par action bonus, volonté inébranlable, élégance sociale.',
      },
    },
    'tradition-monastique': {
      desc: 'Art martial approfondi qui oriente l\'usage du ki et vos techniques.',
      opts: {
        'Voie de la faucheuse':       'Ki offensif amplifié, techniques létales et dégâts de nécrose.',
        'Voie de la miséricorde':     'Mains guérisseuses ou empoisonneuses, contrôle du corps ennemi.',
        'Voie des cinq éléments':     'Sorts élémentaires (feu, eau, terre, air) canalisés via le ki.',
        'Voie du poing ouvert':       'Projeter, renverser ou immobiliser avec le ki.',
        'Voie du soleil':             'Rayons radiants, aura de lumière solaire, explosion.',
        'Voie de l\'ombre':           'Téléportation dans les ombres, invisibilité dans l\'obscurité.',
      },
    },
    'serment-sacre': {
      desc: 'Serment solennel qui façonne vos idéaux et vous confère des pouvoirs sacrés uniques.',
      opts: {
        'Serment de conquête':   'Inspirer la terreur, contrôle mental, domination du champ de bataille.',
        'Serment de dévotion':   'Protection des innocents, aura sainte, châtiment renforcé.',
        'Serment de gloire':     'Exploits héroïques, inspiration alliés, aura d\'excellence.',
        'Serment de rédemption': 'Protéger sans tuer, convertir les ennemis, absorber les dégâts.',
        'Serment de vengeance':  'Poursuivre les coupables, sorts de punition, téléportation vengeresse.',
        'Serment des anciens':   'Connexion à la nature, résistance aux sorts, lumière de l\'aube.',
      },
    },
    'ennemi-jure-1': {
      desc: 'Type de créature que vous avez étudié : avantage aux traquages, bonus aux dégâts.',
      opts: {
        'Aberrations':   'Créatures d\'ailleurs : aboleths, flagelleurs mentaux, beholders.',
        'Bêtes':         'Animaux naturels non-magiques et monstrueux.',
        'Célestes':      'Anges, pégases et créatures des plans supérieurs.',
        'Constructions': 'Golems, automates et gardes animés.',
        'Dragons':       'Dragons vrais, drakons, guivres.',
        'Élémentaires':  'Créatures de feu, eau, air et terre.',
        'Fées':          'Créatures du Féerond : korrigans, pixies, nymphes.',
        'Fiélons':       'Démons, diables et créatures des plans inférieurs.',
        'Géants':        'Géants des collines, du givre, du feu, des nuages.',
        'Humanoïdes':    'Orcs, gobelins, humains et autres races.',
        'Monstruosités': 'Créatures magiques inclassables : manticores, basilics.',
        'Morts-vivants': 'Squelettes, zombies, vampires, liches.',
        'Plantes':       'Plantes animées : vigne assassine, shambling mound.',
        'Vases':         'Créatures amorphes : cube gélatineux, vase noire.',
      },
    },
    'explorateur-1': {
      desc: 'Terrain naturel sur lequel vous bénéficiez de déplacements doublés et de discrétion.',
      opts: {
        'Arctique':     'Toundra glacée, banquises, steppes enneigées.',
        'Côte':         'Plages, falaises, zones côtières et estuaires.',
        'Désert':       'Déserts de sable, de sel ou de roche.',
        'Forêt':        'Forêts tempérées, tropicales ou boréales.',
        'Marécage':     'Marais, tourbières, mangroves.',
        'Montagne':     'Hauts reliefs, falaises, zones volcaniques.',
        'Plaine':       'Prairies, savanes, terres agricoles.',
        'Souterrain':   'Grottes, donjons, Outreterre.',
      },
    },
    'archetyp-rodeur': {
      desc: 'Spécialité de chasseur orientant vos techniques de traque et de combat.',
      opts: {
        'Chasseur':          'Techniques anti-foule, anti-colosse ou parade améliorée.',
        'Erreur glauque':    'Magie étrange et imprévisible, effets aléatoires puissants.',
        'Horizon':           'Déplacements accélérés et sorts liés aux grands espaces.',
        'Maître des bêtes':  'Compagnon animal intégré au combat.',
        'Tueur de monstres': 'Analyse des monstres, riposte sur sort, sorts défensifs.',
      },
    },
    'archetyp-roublard': {
      desc: 'Archétype définissant votre style de ruse et vos techniques spécialisées.',
      opts: {
        'Âme volée':         'Pouvoirs psychiques, lecture des émotions, parasite mental.',
        'Assassin':          'Dégâts maximaux en surprise, déguisement parfait, poison.',
        'Détective':         'Déduction rapide, analyse de scènes, interrogatoire.',
        'Escroc':            'Charme redoublé, imposteur parfait, chance insolente.',
        'Esprit arcanique':  'Sorts de magicien, objet magique lié, vol de sort.',
        'Fantôme':           'Possession spectrale, intangibilité, lien avec les morts.',
        'Maître des couteaux': 'Attaques à distance améliorées, vol en combat, lames magiques.',
      },
    },
    'origine-sorciere': {
      desc: 'Source de votre pouvoir magique inné qui détermine vos capacités spéciales.',
      opts: {
        'Distorsion de la réalité': 'Manipulation de la chance et des probabilités.',
        'Héritage draconique':      'Résistance aux dégâts selon le dragon ancestral, ailes à haut niveau.',
        'Magie de feu':             'Sorts de feu amplifiés, flammes réactives.',
        'Magie sauvage':            'Surtension magique aléatoire, chance chaotique.',
        'Ombres divines':           'Pouvoirs d\'obscurité, résistance nécrotique.',
        'Tempête':                  'Sorts de foudre et tonnerre, résistance électrique.',
        'Âme mécanique':            'Contrôle sur la chance, résistance aux dégâts aléatoires.',
      },
    },
    'metamagie': {
      desc: 'Techniques permettant de modifier la façon dont vous lancez vos sorts.',
      opts: {
        'Sorts accélérés': 'Lancer un sort (1 action) avec une action bonus.',
        'Sorts amplifiés': 'Relancer les dés de dégâts inférieurs à 1 ou 2.',
        'Sorts distants':  'Doubler la portée d\'un sort, ou toucher à 30 pi.',
        'Sorts étendus':   'Doubler la durée d\'un sort de concentration.',
        'Sorts hautains':  'Ignorer la résistance d\'une cible aux dégâts du sort.',
        'Sorts jumeaux':   'Cibler deux créatures avec un sort à cible unique.',
        'Sorts prudents':  'Les alliés réussissent automatiquement leurs jets de sauvegarde.',
        'Sorts subtils':   'Lancer sans composantes verbales ni gestuelles.',
      },
    },
    'protecteur-au-dela': {
      desc: 'Entité surnaturelle qui vous a accordé vos pouvoirs en échange d\'un service.',
      opts: {
        'Archifée':           'Magie du charme et de la peur, connexion au Féerond.',
        'Céleste':            'Pouvoirs de lumière et de soin, résistance radieuse.',
        'Faucheuse non-morte': 'Pouvoirs de mort, nécrose, contrôle des morts-vivants.',
        'Génie':              'Génie lié (dao, djinn, éfrit, marid) avec pouvoirs élémentaires.',
        'Grand Ancien':       'Télépathie, connexion aux plans lointains.',
        'Immonde':            'Résistance aux dégâts, sorts infernaux, résurrection temporaire.',
      },
    },
    'pacte-magique': {
      desc: 'Don de votre protecteur qui matérialise le lien de votre pacte.',
      opts: {
        'Pacte de la chaîne':  'Familier amélioré : pseudo-dragon, quasit, diablotin ou sprite.',
        'Pacte de la lame':    'Arme de pacte magique évolutive, invocable à volonté.',
        'Pacte du grimoire':   'Grimoire des ombres avec 3 sorts mineurs supplémentaires.',
      },
    },
    'invocations': {
      desc: 'Pouvoirs occultes permanents accordés par votre protecteur.',
      opts: {
        'Armure des ombres':          'Lancez armure du mage à volonté sans emplacement.',
        'Bonds du limier':            'Lancez saut à volonté sans emplacement.',
        'Lance de Léthé':             'Ajoutez 1d6 dégâts psychiques à vos touches.',
        'Marque du sentinelle':       'Avantage sur Perception, bonus aux traquages.',
        'Parole répulsive':           'Lancez répulsion une fois par repos long.',
        'Répit du trompeur':          'Lancez invisibilité une fois par repos court.',
        'Regard du sorcier':          'Voyez dans le noir jusqu\'à 30 pi.',
        'Souffle de la nuit':         'Lancez silence une fois par repos long.',
        'Vision du diable':           'Voyez dans l\'obscurité totale jusqu\'à 120 pi.',
        'Voix du maître des chaînes': 'Communiquez télépathiquement avec votre familier.',
        'Yeux de la rune gardienne':  'Lancez identification à volonté sans emplacement.',
      },
    },
    'tradition-arcanique': {
      desc: 'École de magie dans laquelle vous vous êtes spécialisé.',
      opts: {
        'Chronurgie':             'Manipulation du temps, ralentissement ou accélération des alliés.',
        'Graviturgie':            'Manipulation de la gravité, attraction et répulsion.',
        'Magie de guerre':        'Concentration renforcée, sorts défensifs et contre-sorts.',
        'École d\'abjuration':    'Bouclier arcanique permanent, résistances renforcées.',
        'École d\'enchantement':  'Charme et contrôle mental renforcés, suggestion amplifiée.',
        'École d\'évocation':     'Dégâts amplifiés, alliés épargnés dans les zones d\'effet.',
        'École d\'illusion':      'Illusions semi-réelles, malléabilité totale des illusions.',
        'École d\'invocation':    'Invocations renforcées, téléportation de créatures.',
        'École de divination':    'Présages, deux dés de précognition par repos long.',
        'École de nécromancie':   'Morts-vivants renforcés, drain de vie, armée de zombies.',
        'École de transmutation': 'Transmutation de matériaux, transformation du corps.',
      },
    },
  };

  // Shared aliases
  CF_DESCS['ennemi-jure-2'] = CF_DESCS['ennemi-jure-3'] = CF_DESCS['ennemi-jure-1'];
  CF_DESCS['explorateur-2'] = CF_DESCS['explorateur-3'] = CF_DESCS['explorateur-1'];

  function getClassKey(cls) {
    if (!cls) return null;
    return CLASS_KEY_MAP[cls.toLowerCase().trim()] || null;
  }

  function getClassFeatureList(cls, level) {
    const key = getClassKey(cls);
    if (!key) return [];
    return (CLASS_FEATURES[key] || []).filter(f => f.l <= level);
  }

  function getMultiTotalCount(features, id) {
    let count = 0;
    for (const f of features) {
      if ((f.id || f.name) === id && (f.t === 'multi' || f.t === 'multi-more')) count += f.count;
    }
    return count;
  }

  function getPendingChoicesCount(cls, level) {
    const features = getClassFeatureList(cls, level);
    const choices = character.classFeatureChoices || {};
    let count = 0;
    const seenMulti = new Set();
    for (const f of features) {
      const id = f.id || f.name;
      if (f.t === 'choice' && !choices[id]) count++;
      if (f.t === 'multi' && !seenMulti.has(id)) {
        seenMulti.add(id);
        const need = getMultiTotalCount(features, id);
        const have = (choices[id] || []).length;
        if (have < need) count++;
      }
    }
    const typedData = getTypedFeatures(cls);
    if (typedData) count += getTypedPendingCount(typedData, level, choices);
    return count;
  }

  // ---- Capacités de classe : structure typée (par type/rubrique) ----
  // Utilisée pour les classes dont les sous-classes confèrent des features nommées
  // et des listes de sorts étendues.
  // selectionType: 'single' (choisir 1) | 'multi' (choisir N)
  // countByLevel: pour multi, nombre CUMULATIF de choix par niveau de personnage
  // spells: [{l: niveau_perso_min, names:[...]}] — sorts étendus accessibles
  const CLASS_FEATURES_TYPED = {
    'occultiste': {
      types: [
        {
          id: 'patron',
          name: 'Patron d\'outretombe',
          grantedAt: 1,
          selectionType: 'single',
          options: [
            {
              id: 'grand-ancien',
              name: 'Grand Ancien',
              desc: 'Entité cosmique dont l\'intelligence est totalement étrangère à toute logique mortelle.',
              spells: [
                { l:1, names:['Dissonance psychique', 'Rire hideux de Tasha'] },
                { l:3, names:['Détection des pensées', 'Force fantasmagorique'] },
                { l:5, names:['Clairvoyance', 'Envoi de message'] },
                { l:7, names:['Domination de bête', 'Tentacules noirs d\'Evard'] },
                { l:9, names:['Domination de personne', 'Vision suprême'] },
              ],
              features: [
                { l:1, name:'Éveil de l\'esprit', desc:'Télépathie avec toute créature comprenant une langue dans un rayon de 9 m.' },
                { l:6, name:'Protection entropique', desc:'Réaction : imposer le désavantage à une attaque vous ciblant. Si elle rate, capacité rechargée.' },
                { l:10, name:'Bouclier de pensée', desc:'Résistance aux dégâts psychiques ; tout attaquant psychique subit autant de dégâts en retour.' },
                { l:14, name:'Créer des esclaves', desc:'Touchez un humanoïde charmé : il devient votre esclave mental, sans limite de durée.' },
              ],
            },
            {
              id: 'archifee',
              name: 'Archifée',
              desc: 'Seigneur ou dame féerique d\'une puissance et d\'un mystère insurpassables du Féerond.',
              spells: [
                { l:1, names:['Lueurs féeriques', 'Sommeil'] },
                { l:3, names:['Apaisement des émotions', 'Force fantasmagorique'] },
                { l:5, names:['Clignotement', 'Croissance végétale'] },
                { l:7, names:['Domination de bête', 'Invisibilité supérieure'] },
                { l:9, names:['Domination de personne', 'Illusion de groupe'] },
              ],
              features: [
                { l:1, name:'Présence féerique', desc:'Action : charmez ou effrayez les créatures dans un cube de 3 m jusqu\'à la fin de votre prochain tour.' },
                { l:6, name:'Fuite brumeuse', desc:'Réaction lorsque vous subissez des dégâts : devenez invisible et téléportez-vous jusqu\'à 18 m.' },
                { l:10, name:'Défenses de séduction', desc:'Immunité au charme ; toute tentative de charme se retourne contre son auteur.' },
                { l:14, name:'Sombre délire', desc:'Plongez une créature dans une hallucination d\'un autre plan pendant 1 minute.' },
              ],
            },
            {
              id: 'immonde',
              name: 'Immonde',
              desc: 'Puissant être des plans inférieurs — démon, diable ou autre fiélon de haut rang.',
              spells: [
                { l:1, names:['Mains brûlantes', 'Commandement'] },
                { l:3, names:['Cécité/Surdité', 'Rayon ardent'] },
                { l:5, names:['Boule de feu', 'Nuage puant'] },
                { l:7, names:['Bouclier de feu', 'Mur de feu'] },
                { l:9, names:['Colonne de flamme', 'Sanctification'] },
              ],
              features: [
                { l:1, name:'Bénédiction des ténèbres', desc:'Lorsque vous réduisez une créature à 0 PV, gagnez des PV temporaires (mod. Charisme + niveau).' },
                { l:6, name:'Propre chance', desc:'Réaction : ajoutez 1d10 à votre jet de sauvegarde ou à un jet d\'attaque ennemi vous ciblant.' },
                { l:10, name:'Résistance infernale', desc:'Résistance à un type de dégât élémentaire (feu, froid, foudre, poison ou acide).' },
                { l:14, name:'Halo de terreur', desc:'Action : les créatures de votre choix à 9 m doivent réussir un jet de Sagesse ou être effrayées.' },
              ],
            },
            {
              id: 'celeste',
              name: 'Céleste',
              desc: 'Être des plans supérieurs : ange, dieu solaire ou gardien divin.',
              spells: [
                { l:1, names:['Soins', 'Flammes sacrées'] },
                { l:3, names:['Soins de groupe', 'Lumière du jour'] },
                { l:5, names:['Gardien de la foi', 'Protection contre l\'énergie'] },
                { l:7, names:['Gardien de la foi', 'Guérison de groupe'] },
                { l:9, names:['Flamme sainte', 'Flamme sainte'] },
              ],
              features: [
                { l:1, name:'Lumière de guérison', desc:'Action bonus : dépensez des dés de guérison (d6) pour soigner un allié ou vous-même à 18 m.' },
                { l:1, name:'Sort mineur supplémentaire', desc:'Vous connaissez les sorts mineurs Flammes sacrées et Lumière.' },
                { l:6, name:'Radiance de l\'Aube', desc:'Dissipez les ténèbres magiques et infligez des dégâts radiants aux créatures proches.' },
                { l:10, name:'Âme de guérison', desc:'Résistance aux dégâts radiants et nécrotiques.' },
                { l:14, name:'Vengeance ardente', desc:'Au début d\'un combat où vous étiez à 0 PV, relevez-vous avec la moitié de vos PV max.' },
              ],
            },
            {
              id: 'faucheuse-non-morte',
              name: 'Faucheuse non-morte',
              desc: 'Entité liée à la mort et à l\'au-delà : liche, vampire ancestral ou dieu de la mort.',
              spells: [
                { l:1, names:['Rayon empoisonné', 'Fausse mort'] },
                { l:3, names:['Cécité/Surdité', 'Souffle de vie'] },
                { l:5, names:['Animation des morts', 'Parler aux morts'] },
                { l:7, names:['Flétrissure', 'Protection contre la mort'] },
                { l:9, names:['Contagion', 'Nuage mortel'] },
              ],
              features: [
                { l:1, name:'Forme de la tombe', desc:'Action bonus : devenez mort-vivant pendant 1 minute (immunités, mais vulnérabilité aux radiants).' },
                { l:6, name:'Résistance inébranlable', desc:'Résistance aux dégâts nécrotiques ; votre âge biologique cesse de progresser.' },
                { l:10, name:'Regard du gardien', desc:'Réaction : imposez désavantage à un jet de sauvegarde contre la mort d\'une créature à 9 m.' },
                { l:14, name:'Indestructible', desc:'Une fois par repos long, quand vous tombez à 0 PV, tombez à 1 PV à la place.' },
              ],
            },
            {
              id: 'genie',
              name: 'Génie',
              desc: 'Génie lié (dao, djinn, éfrit ou marid) dont le sous-type est choisi à la création.',
              spells: [
                { l:1, names:['Détection du mal et du bien', 'Serviteur invisible'] },
                { l:3, names:['Phantasme', 'Peau d\'écorce'] },
                { l:5, names:['Vol', 'Tempête de neige'] },
                { l:7, names:['Porte dimensionnelle', 'Tentacules noirs d\'Evard'] },
                { l:9, names:['Passe-muraille', 'Scrutation'] },
              ],
              features: [
                { l:1, name:'Vase du génie', desc:'Vase portable servant d\'espace extradimensionnel et de focaliseur d\'incantation.' },
                { l:1, name:'Héritage du génie', desc:'Sort mineur et résistance aux dégâts selon le type de génie choisi.' },
                { l:6, name:'Exil du génie', desc:'Action : envoyez une créature dans la vase jusqu\'à 1 minute (jet de Charisme pour résister).' },
                { l:10, name:'Sanctuaire de la vase', desc:'Téléportez-vous dans la vase en action bonus pour vous reposer jusqu\'à 4h.' },
                { l:14, name:'Don du génie', desc:'Sorts supplémentaires et résistances liés au sous-type de génie choisi.' },
              ],
            },
          ],
        },
        {
          id: 'faveur-de-pacte',
          name: 'Faveur de pacte',
          grantedAt: 3,
          selectionType: 'single',
          options: [
            {
              id: 'chaine',
              name: 'Pacte de la chaîne',
              desc: 'Votre sort Trouver un familier est amélioré : familier spécial (pseudo-dragon, quasit, diablotin ou lutin).',
              features: [],
            },
            {
              id: 'lame',
              name: 'Pacte de la lame',
              desc: 'Action bonus : faites apparaître une arme de pacte magique dans votre main. Elle sert de focaliseur d\'incantation.',
              features: [],
            },
            {
              id: 'grimoire',
              name: 'Pacte du grimoire',
              desc: 'Grimoire des ombres contenant 3 sorts mineurs supplémentaires de n\'importe quelle classe.',
              features: [],
            },
          ],
        },
        {
          id: 'manifestations-occultes',
          name: 'Manifestations occultes',
          grantedAt: 2,
          selectionType: 'multi',
          countByLevel: { 2:2, 5:3, 7:4, 9:5, 12:6, 15:7, 18:8 },
          options: [
            { id: 'vision-du-diable',   name: 'Vision du diable',          desc: 'Voyez dans l\'obscurité totale (magique et non-magique) jusqu\'à 36 m.' },
            { id: 'armure-des-ombres',  name: 'Armure des ombres',         desc: 'Lancez armure du mage sur vous-même à volonté, sans emplacement de sort.' },
            { id: 'bonds-du-limier',    name: 'Bonds du limier',           desc: 'Lancez saut sur vous-même à volonté, sans emplacement.' },
            { id: 'lance-de-lethe',     name: 'Lance de Léthé',            desc: 'Vos touches avec la lance du pacte ajoutent 1d6 dégâts psychiques.' },
            { id: 'marque-sentinelle',  name: 'Marque du sentinelle',      desc: 'Avantage aux jets de Perception (Sagesse) et bonus +10 à la vitesse lors de traquages.' },
            { id: 'parole-repulsive',   name: 'Parole répulsive',          desc: 'Lancez répulsion une fois par repos long, sans emplacement.' },
            { id: 'repit-du-trompeur',  name: 'Répit du trompeur',         desc: 'Lancez invisibilité sur vous-même une fois par repos court, sans emplacement.' },
            { id: 'regard-du-sorcier',  name: 'Regard du sorcier',         desc: 'Voyez dans le noir jusqu\'à 9 m (vos yeux deviennent entièrement noirs).' },
            { id: 'souffle-nuit',       name: 'Souffle de la nuit',        desc: 'Lancez silence une fois par repos long, sans emplacement.' },
            { id: 'voix-maitre-chaines',name: 'Voix du maître des chaînes',desc: 'Communiquez télépathiquement avec votre familier de pacte (dans les 30 m).' },
            { id: 'yeux-rune',          name: 'Yeux de la rune gardienne', desc: 'Lancez identification à volonté, sans emplacement.' },
            { id: 'malediction-agrippante', name: 'Malédiction agrippante',desc: 'Lancez malédiction sans emplacement une fois par repos court.' },
            { id: 'murmures-tombeau',   name: 'Murmures du tombeau',       desc: 'Communiquez avec un cadavre comme avec Parler aux morts, à volonté.' },
          ],
        },
      ],
    },
  };

  function getTypedFeatures(cls) {
    const key = getClassKey(cls);
    return key ? (CLASS_FEATURES_TYPED[key] || null) : null;
  }

  function computeMultiCount(type, level) {
    let count = 0;
    for (const [lvl, cnt] of Object.entries(type.countByLevel || {})) {
      if (parseInt(lvl) <= level) count = Math.max(count, cnt);
    }
    return count;
  }

  function getTypedPendingCount(typedData, level, choices) {
    let count = 0;
    for (const type of typedData.types) {
      if (type.grantedAt > level) continue;
      if (type.selectionType === 'single' && !choices[type.id]) count++;
      if (type.selectionType === 'multi') {
        const need = computeMultiCount(type, level);
        const have = (choices[type.id] || []).length;
        if (have < need) count++;
      }
    }
    return count;
  }

  function getExtendedSpellsForLearn() {
    const typedData = getTypedFeatures(character.class);
    if (!typedData || !allSpellsCache) return [];
    const choices = character.classFeatureChoices || {};
    const level   = character.level || 1;
    const names   = new Set();
    for (const type of typedData.types) {
      if (type.selectionType !== 'single') continue;
      const chosenId = choices[type.id];
      if (!chosenId) continue;
      const opt = type.options.find(o => o.id === chosenId);
      if (!opt || !opt.spells) continue;
      for (const sg of opt.spells) {
        if (sg.l <= level) sg.names.forEach(n => names.add(n.toLowerCase()));
      }
    }
    if (names.size === 0) return [];
    const classIds = new Set((spellsCache || []).map(s => s.id));
    return allSpellsCache.filter(s => names.has(s.name.toLowerCase()) && !classIds.has(s.id));
  }

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

  // Limites de sorts connus par classe et niveau (sorts de classe uniquement)
  const SPELL_LEARN_LIMITS = {
    occultiste: {
      1:  { cantrips: 2, spells: 2 },
      2:  { cantrips: 2, spells: 3 },
      3:  { cantrips: 2, spells: 4 },
      4:  { cantrips: 3, spells: 5 },
      5:  { cantrips: 3, spells: 6 },
      6:  { cantrips: 3, spells: 7 },
      7:  { cantrips: 3, spells: 8 },
      8:  { cantrips: 3, spells: 9 },
      9:  { cantrips: 3, spells: 10 },
      10: { cantrips: 4, spells: 10 },
      11: { cantrips: 4, spells: 11 },
      12: { cantrips: 4, spells: 11 },
      13: { cantrips: 4, spells: 12 },
      14: { cantrips: 4, spells: 12 },
      15: { cantrips: 4, spells: 13 },
      16: { cantrips: 4, spells: 13 },
      17: { cantrips: 4, spells: 14 },
      18: { cantrips: 4, spells: 14 },
      19: { cantrips: 4, spells: 15 },
      20: { cantrips: 4, spells: 15 },
    },
  };

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

  function makeLeaves(cat) { return WEAPON_TYPES.filter(w => w.cat === cat).map(w => ({ label: w.name })); }
  const PROF_TREES = {
    weapons: [
      { label: 'Armes courantes', children: [
        { label: 'Corps à corps courante', children: makeLeaves('Corps à corps courante') },
        { label: 'Distance courante',      children: makeLeaves('Distance courante') },
      ]},
      { label: 'Armes de guerre', children: [
        { label: 'Corps à corps de guerre', children: makeLeaves('Corps à corps de guerre') },
        { label: 'Distance de guerre',      children: makeLeaves('Distance de guerre') },
      ]},
    ],
    armor: [
      { label: 'Armures légères', children: [
        { label: 'Armure matelassée' }, { label: 'Armure de cuir' }, { label: 'Armure de cuir clouté' },
      ]},
      { label: 'Armures intermédiaires', children: [
        { label: 'Armure de peau' }, { label: 'Armure de chaînes' }, { label: 'Cuirasse' }, { label: 'Demi-plate' },
      ]},
      { label: 'Armures lourdes', children: [
        { label: 'Broigne' }, { label: 'Cotte de mailles' }, { label: "Armure d'écailles" }, { label: 'Armure de plates' },
      ]},
      { label: 'Bouclier' },
    ],
    tools: [
      { label: "Outils d'artisan", children: [
        { label: 'Outils de brasseur' }, { label: 'Outils de calligraphe' }, { label: 'Outils de charpentier' },
        { label: 'Outils de cordonnier' }, { label: 'Outils de forgeron' }, { label: 'Outils de joaillier' },
        { label: 'Outils de maçon' }, { label: 'Outils de menuisier' }, { label: 'Outils de peintre' },
        { label: 'Outils de potier' }, { label: 'Outils de sellier' }, { label: 'Outils de tanneur' }, { label: 'Outils de tisserand' },
      ]},
      { label: 'Instruments de musique', children: [
        { label: 'Chalumeau' }, { label: 'Cithare' }, { label: 'Cor' }, { label: 'Cornemuse' },
        { label: 'Flûte' }, { label: 'Luth' }, { label: 'Lyre' }, { label: 'Tambour' }, { label: 'Tympanon' }, { label: 'Viole' },
      ]},
      { label: 'Trousses et équipements', children: [
        { label: 'Kit de faussaire' }, { label: 'Matériel de déguisement' }, { label: "Matériel d'empoisonneur" },
        { label: 'Outils de cartographe' }, { label: 'Outils de navigation' }, { label: 'Outils de voleur' }, { label: "Trousse d'herboriste" },
      ]},
      { label: 'Jeux', children: [
        { label: 'Jeu de dés' }, { label: 'Jeu de cartes à jouer' }, { label: 'Trictrac' }, { label: "Jeu d'échecs draconiques" },
      ]},
      { label: 'Véhicules', children: [
        { label: 'Véhicules terrestres' }, { label: 'Véhicules aquatiques' },
      ]},
    ],
  };

  let BACKGROUNDS_DATA = [
    { name: 'Acolyte',   skills: ['Perspicacité', 'Religion'],      tools: ['Outils de calligraphe'],  toolChoice: null,                  equipment: 'Outils de calligraphe, livre de prières, symbole sacré, parchemin, robe, 8 po' },
    { name: 'Artisan',   skills: ['Investigation', 'Persuasion'],   tools: [],                          toolChoice: "Outils d'artisan",    equipment: "Outils d'artisan (au choix), 2 bourses, vêtements de voyageur, 32 po" },
    { name: 'Artiste',   skills: ['Acrobaties', 'Représentation'],  tools: [],                          toolChoice: 'Instruments de musique', equipment: 'Instrument de musique (au choix), 2 costumes, miroir, parfum, vêtements de voyageur, 11 po' },
    { name: 'Charlatan', skills: ['Escamotage', 'Tromperie'],       tools: ['Kit de faussaire'],        toolChoice: null,                  equipment: 'Kit de faussaire, costume, beaux vêtements, 15 po' },
    { name: 'Criminel',  skills: ['Discrétion', 'Escamotage'],      tools: ['Outils de voleur'],        toolChoice: null,                  equipment: '2 dagues, outils de voleur, pied-de-biche, 2 bourses, vêtements de voyageur, 16 po' },
    { name: 'Ermite',    skills: ['Médecine', 'Religion'],          tools: ["Trousse d'herboriste"],    toolChoice: null,                  equipment: "Bâton, trousse d'herboriste, rouleau de couchage, livre de philosophie, lampe, 3 flacons d'huile, vêtements de voyageur, 16 po" },
    { name: 'Fermier',   skills: ['Dressage', 'Nature'],            tools: ['Outils de charpentier'],  toolChoice: null,                  equipment: 'Faucille, outils de charpentier, kit de guérisseur, marmite en fer, pelle, vêtements de voyageur, 30 po' },
    { name: 'Garde',     skills: ['Athlétisme', 'Perception'],      tools: [],                          toolChoice: 'Jeux',                equipment: 'Lance, arbalète légère, 20 carreaux, jeu (au choix), lanterne, menottes, carquois, vêtements de voyageur, 12 po' },
    { name: 'Guide',     skills: ['Discrétion', 'Survie'],          tools: ['Outils de cartographe'],  toolChoice: null,                  equipment: 'Arc court, 20 flèches, outils de cartographe, rouleau de couchage, carquois, tente, vêtements de voyageur, 3 po' },
    { name: 'Marchand',  skills: ['Dressage', 'Persuasion'],        tools: ['Outils de navigation'],   toolChoice: null,                  equipment: 'Outils de navigation, 2 bourses, vêtements de voyageur, 22 po' },
    { name: 'Marin',     skills: ['Acrobaties', 'Perception'],      tools: ['Outils de navigation'],   toolChoice: null,                  equipment: 'Dague, outils de navigation, corde, vêtements de voyageur, 20 po' },
    { name: 'Noble',     skills: ['Histoire', 'Persuasion'],        tools: [],                          toolChoice: 'Jeux',                equipment: 'Jeu (au choix), beaux vêtements, parfum, 29 po' },
    { name: 'Sage',      skills: ['Arcanes', 'Histoire'],           tools: ['Outils de calligraphe'],  toolChoice: null,                  equipment: "Bâton, outils de calligraphe, livre d'histoire, 8 parchemins, robe, 8 po" },
    { name: 'Scribe',    skills: ['Investigation', 'Perception'],   tools: ['Outils de calligraphe'],  toolChoice: null,                  equipment: "Outils de calligraphe, beaux vêtements, lampe, 3 flacons d'huile, 12 parchemins, 23 po" },
    { name: 'Soldat',    skills: ['Athlétisme', 'Intimidation'],    tools: [],                          toolChoice: 'Jeux',                equipment: 'Lance, arc court, 20 flèches, jeu (au choix), kit de guérisseur, carquois, vêtements de voyageur, 14 po' },
    { name: 'Voyageur',  skills: ['Discrétion', 'Perspicacité'],   tools: ['Outils de voleur'],        toolChoice: null,                  equipment: '2 dagues, outils de voleur, jeu, rouleau de couchage, 2 bourses, vêtements de voyageur, 16 po' },
  ];

  const LANGUAGES_DATA = [
    { name: 'Commun',                  script: 'Commun',     races: 'Humains',                        exotic: false },
    { name: 'Elfique',                 script: 'Elfique',    races: 'Elfes',                          exotic: false },
    { name: 'Géant',                   script: 'Nain',       races: 'Ogres, géants',                  exotic: false },
    { name: 'Gnome',                   script: 'Nain',       races: 'Gnomes',                         exotic: false },
    { name: 'Gobelin',                 script: 'Nain',       races: 'Gobelinoïdes',                   exotic: false },
    { name: 'Halfelin',                script: 'Commun',     races: 'Halfelins',                      exotic: false },
    { name: 'Nain',                    script: 'Nain',       races: 'Nains',                          exotic: false },
    { name: 'Orc',                     script: 'Nain',       races: 'Orcs',                           exotic: false },
    { name: 'Abyssal',                 script: 'Infernal',   races: 'Démons',                         exotic: true  },
    { name: 'Céleste',                 script: 'Céleste',    races: 'Célestes',                       exotic: true  },
    { name: 'Commun des profondeurs',  script: 'Elfique',    races: "Créatures de l'Outreterre",      exotic: true  },
    { name: 'Draconique',              script: 'Draconique', races: 'Dragons, drakéides',             exotic: true  },
    { name: 'Infernal',                script: 'Infernal',   races: 'Diables',                        exotic: true  },
    { name: 'Primordial',              script: 'Nain',       races: 'Élémentaires',                   exotic: true  },
    { name: 'Profond',                 script: '—',          races: 'Beholders, flagelleurs mentaux', exotic: true  },
    { name: 'Sylvestre',               script: 'Elfique',    races: 'Créatures féeriques',            exotic: true  },
  ];

  const EQUIPMENT_SLOT_TYPES = [
    { key: 'head1',  label: 'Tête',             icon: '🪖' },
    { key: 'head2',  label: 'Tête (accessoire)', icon: '👓' },
    { key: 'chest',  label: 'Buste (armure)',    icon: '🥋' },
    { key: 'legs',   label: 'Jambes',            icon: '👖' },
    { key: 'feet',   label: 'Pieds',             icon: '👢' },
    { key: 'belt',   label: 'Ceinture',          icon: '🪢' },
    { key: 'back',   label: 'Dos',               icon: '🧣' },
    { key: 'neck',   label: 'Cou',               icon: '📿' },
    { key: 'wrist',  label: 'Poignet',           icon: '⌚' },
    { key: 'finger', label: 'Doigt',             icon: '💍' },
    { key: 'outfit', label: 'Tenue',             icon: '👘' },
    { key: 'shield', label: 'Bouclier',          icon: '🛡️' },
  ];

  let ARMOR_CATEGORIES = {
    'Légère':       [
      { name: 'Matelassée',  baseCA: 11, dex: 'full' },
      { name: 'Cuir',        baseCA: 11, dex: 'full' },
      { name: 'Cuir clouté', baseCA: 12, dex: 'full' },
    ],
    'Intermédiaire': [
      { name: 'Peaux',              baseCA: 12, dex: 'max2' },
      { name: 'Chemise de mailles', baseCA: 13, dex: 'max2' },
      { name: 'Écailles',           baseCA: 14, dex: 'max2' },
      { name: 'Cuirasse',           baseCA: 14, dex: 'max2' },
      { name: 'Demi-plate',         baseCA: 15, dex: 'max2' },
    ],
    'Lourde': [
      { name: 'Anneaux',          baseCA: 14, dex: 'none' },
      { name: 'Cottes de mailles',baseCA: 16, dex: 'none' },
      { name: 'Éclisses',         baseCA: 17, dex: 'none' },
      { name: 'Harnois',          baseCA: 18, dex: 'none' },
    ],
  };

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
  let racesCache = null;
  let classesCache = null;
  let weaponsCache = null;
  let armorCache = null;
  let backgroundsCache = null;
  let conditionsCache = null;
  let saveTimeout = null;
  let editMode = false;
  let consumablesCollapsed = true;
  let questCollapsed = true;
  let weaponsInvCollapsed = true;
  let scrollsCollapsed = true;
  let weaponTypeCatFilter = 'Tous';
  let allSpellsCache = null;
  let weaponEditIndex = null;
  let equipCollapsed = true;
  let equipEditIndex = null;
  // Spell filter state
  let sfLevels  = new Set();     // empty = tous niveaux
  let sfKnown   = 'known';       // 'known' | 'all'
  let sfAvail   = 'available';   // 'available' | 'all'
  let sfOrigin  = new Set();     // empty = toutes origines
  let sfDamage  = 'all';         // 'all' | 'yes' | 'no'

  // Learn modal state
  let lsSearch  = '';
  let lsLevels  = new Set();
  let lsDamage  = 'all';
  let lsSelected = new Set();

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

  async function loadStaticData() {
    const [racesRes, classesRes, weaponsRes, armorRes, backgroundsRes, conditionsRes] = await Promise.all([
      apiFetch('/api/races'),
      apiFetch('/api/classes'),
      apiFetch('/api/weapons'),
      apiFetch('/api/armor'),
      apiFetch('/api/backgrounds'),
      apiFetch('/api/conditions'),
    ]);
    if (racesRes.ok) racesCache = await racesRes.json();
    if (classesRes.ok) classesCache = await classesRes.json();
    if (weaponsRes.ok) weaponsCache = await weaponsRes.json();
    if (armorRes.ok) armorCache = await armorRes.json();
    if (backgroundsRes.ok) backgroundsCache = await backgroundsRes.json();
    if (conditionsRes.ok) conditionsCache = await conditionsRes.json();
    if (armorCache) {
      ARMOR_CATEGORIES = {};
      armorCache.filter(a => a.category !== 'Bouclier').forEach(a => {
        if (!ARMOR_CATEGORIES[a.category]) ARMOR_CATEGORIES[a.category] = [];
        ARMOR_CATEGORIES[a.category].push(a);
      });
    }
    if (backgroundsCache) {
      BACKGROUNDS_DATA = backgroundsCache.map(bg => ({
        name: bg.name, skills: bg.skills, tools: bg.tools || [],
        toolChoice: bg.toolChoice || null, equipment: bg.equipment,
        feature: bg.feature || null, featureDesc: bg.featureDesc || null,
      }));
    }
  }

  async function loadApp() {
    await loadStaticData();
    const res = await apiFetch('/api/character');
    if (!res.ok) {
      localStorage.removeItem('jdr-token');
      $login.classList.remove('hidden');
      $app.classList.add('hidden');
      return;
    }
    character = await res.json();
    if (!character.classFeatureChoices) character.classFeatureChoices = {};
    // Migration: auto-populate racial traits if not set
    if (character.race && !character.traits) {
      character.traits = getRacialTraits(character.race);
    }
    if (character.background && !character.backgroundSkills) {
      const _bg = BACKGROUNDS_DATA.find(b => b.name === character.background);
      character.backgroundSkills = _bg ? _bg.skills : [];
      character.backgroundTools = _bg ? (_bg.tools || []) : [];
      character.backgroundToolChoice = _bg ? (_bg.toolChoice || null) : null;
      if (_bg && character.backgroundTools.length > 0) {
        if (!character.proficiencies) character.proficiencies = {};
        if (!character.proficiencies.tools) character.proficiencies.tools = [];
        for (const t of character.backgroundTools) {
          if (!character.proficiencies.tools.includes(t)) character.proficiencies.tools.push(t);
        }
      }
    }
    await syncSpellSlots();
    initStatsBase();
    $login.classList.add('hidden');
    $app.classList.remove('hidden');
    renderAll();
  }

  async function syncSpellSlots() {
    const cls = (character.class || '').toLowerCase();
    const lvl = character.level || 1;
    if (!cls) return;
    const res = await apiFetch('/api/progression/' + encodeURIComponent(cls) + '/' + lvl);
    if (!res.ok) return;
    const prog = await res.json();
    if (!prog.spellSlots || Object.keys(prog.spellSlots).length === 0) return;
    const current  = JSON.stringify(character.spellSlots || {});
    const expected = JSON.stringify(prog.spellSlots);
    if (current === expected) return;
    character.spellSlots    = prog.spellSlots;
    character.spellSlotsUsed = {};
    saveCharacter();
    renderSpellSlots();
    if (spellsCache) renderSpellsList();
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
      if (target === 'sorts') {
        if (!spellsCache) loadSpells(); else renderSpellsList();
      }
    });
  });

  function profBonusFromLevel(level) {
    return Math.floor((level - 1) / 4) + 2;
  }

  function resolveRaceKey(race) {
    if (!race) return null;
    const key = race.toLowerCase().trim();
    return RACE_ALIASES[key] || key;
  }

  function getRacialBonus(race) {
    if (!racesCache || !race) return {};
    const data = racesCache[resolveRaceKey(race)];
    return data ? (data.bonuses || {}) : {};
  }

  function getRacialTraits(race) {
    if (!racesCache || !race) return [];
    const data = racesCache[resolveRaceKey(race)];
    return data ? (data.traits || []).map(t => t.name) : [];
  }

  function getRaceTraitDetails(race) {
    if (!racesCache || !race) return [];
    const data = racesCache[resolveRaceKey(race)];
    return data ? (data.traits || []) : [];
  }

  function applyRacialData(race) {
    const data = racesCache ? racesCache[resolveRaceKey(race)] : null;
    if (data && data.speed) character.speed = data.speed;

    // Languages: remove old racial langs, add new ones
    const prevRacialLangs = character.racialLanguages || [];
    if (!character.languages) character.languages = { spoken: [], scripts: [] };
    if (!character.languages.spoken) character.languages.spoken = [];
    character.languages.spoken = character.languages.spoken.filter(l => !prevRacialLangs.includes(l));
    const newRacialLangs = [];
    if (data && data.languages) {
      for (const lang of data.languages) {
        if (lang.includes('choix')) continue;
        const matched = LANGUAGES_DATA.find(l => l.name.toLowerCase() === lang.toLowerCase());
        if (matched) {
          if (!character.languages.spoken.includes(matched.name)) character.languages.spoken.push(matched.name);
          newRacialLangs.push(matched.name);
        }
      }
    }
    character.racialLanguages = newRacialLangs;

    // Proficiencies: remove old racial profs, add new ones
    const prevRacialProfs = character.racialProficiencies || [];
    if (!character.proficiencies) character.proficiencies = {};
    if (!character.proficiencies.weapons) character.proficiencies.weapons = [];
    character.proficiencies.weapons = character.proficiencies.weapons.filter(p => !prevRacialProfs.includes(p));
    const newRacialProfs = [];
    if (data && data.proficiencies) {
      for (const prof of data.proficiencies) {
        if (!character.proficiencies.weapons.includes(prof)) character.proficiencies.weapons.push(prof);
        newRacialProfs.push(prof);
      }
    }
    character.racialProficiencies = newRacialProfs;
  }

  function applyClassData(cls) {
    if (!classesCache || !cls) return;
    const data = classesCache[cls.toLowerCase().trim()];
    if (!data) return;
    if (data.savingThrows) character.savingThrows = [...data.savingThrows];

    const prev = character.classProficiencies || { weapons: [], armor: [], tools: [] };
    if (!character.proficiencies) character.proficiencies = {};
    if (!character.proficiencies.weapons) character.proficiencies.weapons = [];
    if (!character.proficiencies.armor) character.proficiencies.armor = [];
    if (!character.proficiencies.tools) character.proficiencies.tools = [];
    character.proficiencies.weapons = character.proficiencies.weapons.filter(p => !(prev.weapons || []).includes(p));
    character.proficiencies.armor   = character.proficiencies.armor.filter(p => !(prev.armor || []).includes(p));
    character.proficiencies.tools   = character.proficiencies.tools.filter(p => !(prev.tools || []).includes(p));
    const next = { weapons: [], armor: [], tools: [] };
    for (const p of (data.weaponProf || [])) {
      if (!character.proficiencies.weapons.includes(p)) character.proficiencies.weapons.push(p);
      next.weapons.push(p);
    }
    for (const p of (data.armorProf || [])) {
      if (!character.proficiencies.armor.includes(p)) character.proficiencies.armor.push(p);
      next.armor.push(p);
    }
    for (const p of (data.toolProf || [])) {
      if (!character.proficiencies.tools.includes(p)) character.proficiencies.tools.push(p);
      next.tools.push(p);
    }
    character.classProficiencies = next;
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
    renderActiveSpells();
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
      $btn.innerHTML = editMode ? '<span class="ic-confirm">✓</span>' : '<span class="ic-pencil">✏</span>';
      $btn.title = editMode ? 'Verrouiller' : 'Modifier';
      $btn.classList.toggle('btn-edit-active', editMode);
    }

    // Peupler les selects race et classe depuis les caches
    const $raceSelect = document.querySelector('select[data-field="race"]');
    if ($raceSelect && racesCache) {
      const current = character.race || '';
      $raceSelect.innerHTML = '<option value="">— Choisir —</option>' +
        Object.values(racesCache)
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
          .map(r => `<option value="${r.name}"${r.name === current ? ' selected' : ''}>${r.name}</option>`)
          .join('');
    }
    const $classSelect = document.querySelector('select[data-field="class"]');
    if ($classSelect && classesCache) {
      const current = character.class || '';
      $classSelect.innerHTML = '<option value="">— Choisir —</option>' +
        Object.values(classesCache)
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
          .map(c => `<option value="${c.name}"${c.name === current ? ' selected' : ''}>${c.name}</option>`)
          .join('');
    }

    // Info fields (inputs + selects)
    document.querySelectorAll('.info-field input, .info-field select').forEach((el) => {
      const field = el.dataset.field;
      el.value = character[field] || '';
      el.disabled = !editMode;
      el.onchange = () => {
        if (field === 'background') {
          applyBackground(el.value);
          return;
        }
        character[field] = el.value;
        if (field === 'race') {
          recalcStats();
          character.traits = getRacialTraits(el.value);
          applyRacialData(el.value);
          saveCharacter();
          renderProfil();
          renderCombat();
          renderCapacites();
        }
        if (field === 'class') {
          syncSpellSlots();
          applyClassData(el.value);
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
    const bgSkills = character.backgroundSkills || [];
    for (const skill of SKILLS) {
      const fromBg = bgSkills.includes(skill.name);
      const proficient = fromBg || (character.skills && character.skills[skill.name]);
      const bonus = mod(character.stats[skill.ability]) + (proficient ? character.proficiencyBonus : 0);
      const row = document.createElement('div');
      row.className = 'skill-row';
      const badge = fromBg ? '<span class="skill-bg-badge">(Historique)</span>' : '';
      row.innerHTML =
        '<input type="checkbox"' + (proficient ? ' checked' : '') + ((editMode && !fromBg) ? '' : ' disabled') + '>' +
        '<span class="skill-name">' + skill.name + badge + '</span>' +
        '<span class="bonus">' + (bonus >= 0 ? '+' : '') + bonus + '</span>';
      if (!fromBg) {
        row.querySelector('input').addEventListener('change', (e) => {
          if (!character.skills) character.skills = {};
          character.skills[skill.name] = e.target.checked;
          saveCharacter();
          renderProfil();
        });
      }
      $skills.appendChild(row);
    }

    renderBackgroundBonuses();

    // Perception passive : 10 + mod(Sagesse) + maîtrise éventuelle
    const perceptionProficient = character.skills && character.skills['Perception'];
    const passivePerception = 10 + mod(character.stats.wisdom) + (perceptionProficient ? character.proficiencyBonus : 0);
    document.getElementById('passive-perception').textContent = passivePerception;

    // Skill choices hint from class
    const $skillHint = document.getElementById('class-skill-hint');
    if ($skillHint) {
      const clsKey = character.class ? character.class.toLowerCase().trim() : null;
      const clsData = clsKey && classesCache ? classesCache[clsKey] : null;
      if (clsData && clsData.skillChoices && editMode) {
        $skillHint.innerHTML = '<strong>Compétences de classe</strong> — choisissez ' + clsData.skillChoices.count + ' parmi : ' + clsData.skillChoices.from.join(', ');
        $skillHint.classList.remove('hidden');
      } else {
        $skillHint.classList.add('hidden');
      }
    }

  }

  function applyBackground(name) {
    character.background = name;
    const bg = BACKGROUNDS_DATA.find(b => b.name === name);

    // Remove previous background tools from proficiencies
    const prevBgTools = character.backgroundTools || [];
    if (prevBgTools.length > 0 && character.proficiencies && character.proficiencies.tools) {
      character.proficiencies.tools = character.proficiencies.tools.filter(t => !prevBgTools.includes(t));
    }

    character.backgroundSkills = bg ? bg.skills : [];
    character.backgroundTools = bg ? (bg.tools || []) : [];
    character.backgroundToolChoice = bg ? (bg.toolChoice || null) : null;

    // Auto-add specific background tools to proficiencies
    if (character.backgroundTools.length > 0) {
      if (!character.proficiencies) character.proficiencies = {};
      if (!character.proficiencies.tools) character.proficiencies.tools = [];
      for (const t of character.backgroundTools) {
        if (!character.proficiencies.tools.includes(t)) character.proficiencies.tools.push(t);
      }
    }

    saveCharacter();
    renderProfil();
    renderCapacites();
  }

  function applyBackgroundToolChoice(toolName) {
    if (!character.proficiencies) character.proficiencies = {};
    if (!character.proficiencies.tools) character.proficiencies.tools = [];
    if (!character.backgroundTools) character.backgroundTools = [];
    if (!character.proficiencies.tools.includes(toolName)) character.proficiencies.tools.push(toolName);
    if (!character.backgroundTools.includes(toolName)) character.backgroundTools.push(toolName);
    character.backgroundToolChoice = null;
    saveCharacter();
    renderCapacites();
  }

  function renderBackgroundBonuses() {
    const el = document.getElementById('background-bonuses');
    if (!el) return;
    const bg = BACKGROUNDS_DATA.find(b => b.name === character.background);
    if (!bg || !editMode) { el.innerHTML = ''; el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    const toolDisplay = bg.tools.length > 0
      ? bg.tools.join(', ')
      : (bg.toolChoice ? bg.toolChoice + ' <em>(au choix)</em>' : '—');
    el.innerHTML =
      '<div class="bg-bonus-row"><span class="bg-bonus-label">Compétences</span><span class="bg-bonus-val">' + bg.skills.join(', ') + '</span></div>' +
      '<div class="bg-bonus-row"><span class="bg-bonus-label">Outil</span><span class="bg-bonus-val">' + toolDisplay + '</span></div>' +
      '<div class="bg-bonus-row"><span class="bg-bonus-label">Équipement</span><span class="bg-bonus-val bg-bonus-equip">' + bg.equipment + '</span></div>' +
      (bg.feature ? '<div class="bg-bonus-row bg-bonus-feature"><span class="bg-bonus-label">Capacité</span><span class="bg-bonus-val"><strong>' + bg.feature + '</strong>' + (bg.featureDesc ? ' — ' + bg.featureDesc : '') + '</span></div>' : '');
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

    const clsKey = character.class ? character.class.toLowerCase().trim() : null;
    const clsData = clsKey && classesCache ? classesCache[clsKey] : null;

    const $hitdie = document.getElementById('combat-hitdie');
    if ($hitdie) $hitdie.textContent = clsData ? 'd' + clsData.hitDie : '—';

    const $dv = document.getElementById('combat-darkvision');
    if ($dv) {
      const raceData = racesCache ? racesCache[resolveRaceKey(character.race)] : null;
      $dv.textContent = (raceData && raceData.darkvision) ? raceData.darkvision + ' m' : '—';
    }

    const $hpAuto = document.getElementById('btn-hp-auto');
    if ($hpAuto && clsData) {
      const hitDie = clsData.hitDie;
      const conMod = mod(character.stats.constitution);
      const level = character.level || 1;
      const calcHp = hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
      const safe = Math.max(1, calcHp);
      $hpAuto.title = 'PV calculés : ' + safe + ' (d' + hitDie + ' niv.1 + moyenne × ' + (level - 1) + ' niv. + mod CON ' + (conMod >= 0 ? '+' : '') + conMod + ')';
      $hpAuto.onclick = () => {
        character.hp.max = safe;
        if (character.hp.current > character.hp.max) character.hp.current = character.hp.max;
        saveCharacter();
        renderCombat();
        renderHeader();
      };
    }

    $ac.onchange = () => { character.armorClass = parseInt($ac.value, 10); saveCharacter(); };
    $speed.onchange = () => { character.speed = parseInt($speed.value, 10); saveCharacter(); };

    const $caAuto = document.getElementById('btn-ca-auto');
    if ($caAuto) {
      const dexMod = mod(character.stats.dexterity);
      const equippedNames = Object.values(character.equipmentSlots || {});
      const chestItem = (character.inventoryEquipment || []).find(i => i.slotType === 'chest' && equippedNames.includes(i.name) && i.baseCA);
      let ca;
      if (chestItem) {
        let dexBonus = dexMod;
        for (const armors of Object.values(ARMOR_CATEGORIES)) {
          const found = armors.find(a => a.name === chestItem.name);
          if (found) { if (found.dex === 'max2') dexBonus = Math.min(dexMod, 2); if (found.dex === 'none') dexBonus = 0; break; }
        }
        ca = (chestItem.baseCA + (chestItem.armorBonus || 0)) + dexBonus;
      } else {
        const hasMageArmor = (character.activeSpells || []).some(s => s.id === 'armure-de-mage');
        ca = hasMageArmor ? (13 + dexMod) : (10 + dexMod);
      }
      const hasShield = (character.inventoryEquipment || []).some(i => i.slotType === 'shield' && character.handSlots && (character.handSlots.left === i.name || character.handSlots.right === i.name));
      if (hasShield) ca += 2;
      $caAuto.title = 'CA calculée : ' + ca;
      $caAuto.onclick = () => { character.armorClass = ca; saveCharacter(); renderCombat(); };
    }

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
    const res = await apiFetch('/api/spells?class=' + encodeURIComponent(character.class || ''));
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

  let conditionsCollapsed = true;

  document.getElementById('conditions-header').addEventListener('click', () => {
    conditionsCollapsed = !conditionsCollapsed;
    renderConditions();
  });

  function renderConditions() {
    const $toggle = document.getElementById('conditions-toggle');
    const $body = document.getElementById('conditions-body');
    if (!$toggle || !$body) return;
    $toggle.textContent = conditionsCollapsed ? '▶' : '▼';
    $body.classList.toggle('hidden', conditionsCollapsed);
    if (conditionsCollapsed || !conditionsCache) return;

    const $list = document.getElementById('conditions-list');
    if ($list.childElementCount > 0) return; // render once

    conditionsCache.forEach(cond => {
      const item = document.createElement('div');
      item.className = 'condition-item trait-expandable';

      const header = document.createElement('div');
      header.className = 'trait-racial-header';
      header.innerHTML = '<span>' + (cond.icon || '⚠') + '</span> ' + cond.name;
      item.appendChild(header);

      const body = document.createElement('div');
      body.className = 'trait-racial-desc hidden';
      body.innerHTML = cond.effects.map(e => '<div class="condition-effect">• ' + e + '</div>').join('');
      item.appendChild(body);

      header.addEventListener('click', () => {
        body.classList.toggle('hidden');
        item.classList.toggle('trait-open');
      });
      $list.appendChild(item);
    });
  }

  function renderSpellSlots() {
    // DD et bonus d'attaque des sorts
    const $castStats = document.getElementById('spell-casting-stats');
    if ($castStats) {
      const clsKey = (character.class || '').toLowerCase().trim();
      const ability = SPELLCASTING_ABILITY[clsKey];
      if (ability) {
        const abilityMod = mod(character.stats[ability]);
        const prof = character.proficiencyBonus || 2;
        const dc = 8 + prof + abilityMod;
        const atk = prof + abilityMod;
        $castStats.innerHTML =
          '<span class="cs-item"><span class="cs-label">DD de sauvegarde</span><span class="cs-value">' + dc + '</span></span>' +
          '<span class="cs-item"><span class="cs-label">Bonus d\'attaque</span><span class="cs-value">' + (atk >= 0 ? '+' : '') + atk + '</span></span>' +
          '<span class="cs-item"><span class="cs-label">Caractéristique</span><span class="cs-value">' + (STATS[ability] || ability) + '</span></span>';
        $castStats.classList.remove('hidden');
      } else {
        $castStats.classList.add('hidden');
      }
    }

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

    document.getElementById('btn-short-rest').onclick = () => {
      // Seul l'Occultiste récupère ses emplacements sur repos court
      const clsKey = (character.class || '').toLowerCase().trim();
      if (clsKey === 'occultiste') character.spellSlotsUsed = {};
      rechargeItemSpells(['Repos court', 'Chaque aube', 'À volonté']);
      saveCharacter();
      renderSpellSlots();
      renderActiveSpells();
      if (spellsCache) renderSpellsList();
    };

    document.getElementById('btn-long-rest').onclick = () => {
      character.spellSlotsUsed = {};
      character.hp.current = character.hp.max;
      rechargeItemSpells(['Repos long', 'Repos court', 'Chaque aube', 'À volonté']);
      character.activeSpells = [];
      saveCharacter();
      renderSpellSlots();
      renderCombat();
      renderHeader();
      renderActiveSpells();
      if (spellsCache) renderSpellsList();
    };
  }

  function isSpellAvailable(spell, scrollIds, itemSpellMap) {
    if (spell.level === 0) return true;
    if (itemSpellMap && itemSpellMap[spell.id]) {
      return itemSpellMap[spell.id].some(e => e.equipped && e.usesLeft > 0);
    }
    if (scrollIds && scrollIds.has(spell.id)) {
      const sc = (character.spellScrolls || []).find(s => s.id === spell.id);
      return sc && (sc.qty || 1) > 0;
    }
    const slots = character.spellSlots || {};
    const used  = character.spellSlotsUsed || {};
    for (const lvl of Object.keys(slots)) {
      if (parseInt(lvl, 10) >= spell.level && (slots[lvl] - (used[lvl] || 0)) > 0) return true;
    }
    return false;
  }

  function buildItemSpellMap() {
    const map = {};
    (character.inventoryWeapons || []).forEach(w => {
      const equipped = !!(character.handSlots && (character.handSlots.left === w.name || character.handSlots.right === w.name));
      (w.spells || []).forEach(s => {
        if (!map[s.id]) map[s.id] = [];
        map[s.id].push({ source: w.name, equipped, usesLeft: s.usesLeft !== undefined ? s.usesLeft : (s.uses || 1), uses: s.uses || 1, recovery: s.recovery || 'Repos long' });
      });
    });
    (character.inventoryEquipment || []).forEach(item => {
      const equipped = item.slotType === 'shield'
        ? !!(character.handSlots && (character.handSlots.left === item.name || character.handSlots.right === item.name))
        : Object.values(character.equipmentSlots || {}).some(v => v === item.name);
      (item.spells || []).forEach(s => {
        if (!map[s.id]) map[s.id] = [];
        map[s.id].push({ source: item.name, equipped: !!equipped, usesLeft: s.usesLeft !== undefined ? s.usesLeft : (s.uses || 1), uses: s.uses || 1, recovery: s.recovery || 'Repos long' });
      });
    });
    return map;
  }

  function spellHasDamage(spell) {
    return ((spell.description || '') + ' ' + (spell.higherLevels || '')).toLowerCase().includes('dégâts');
  }

  function getSpellOrigin(spellId) {
    return (character.spellSources || {})[spellId] || 'class';
  }

  function addKnownSpell(id, origin) {
    if (!character.knownSpells)  character.knownSpells  = [];
    if (!character.spellSources) character.spellSources = {};
    if (!character.knownSpells.includes(id)) character.knownSpells.push(id);
    character.spellSources[id] = origin;
    saveCharacter();
    renderSpellsList();
  }

  function removeKnownSpell(id) {
    if (!character.knownSpells) return;
    const idx = character.knownSpells.indexOf(id);
    if (idx >= 0) character.knownSpells.splice(idx, 1);
    if (character.spellSources) delete character.spellSources[id];
    saveCharacter();
    renderSpellsList();
  }

  function getSpellLearnLimits() {
    const cls = (character.class || '').toLowerCase();
    const lvl = character.level || 1;
    const classData = SPELL_LEARN_LIMITS[cls];
    if (!classData) return null;
    return classData[lvl] || null;
  }

  function countClassSpells() {
    const known    = character.knownSpells || [];
    const sources  = character.spellSources || {};
    const pool     = [...(spellsCache || []), ...(allSpellsCache || [])];
    const itemMap  = buildItemSpellMap();
    const scrollIds = new Set((character.spellScrolls || []).map(s => s.id));
    let cantrips = 0, spells = 0;
    for (const id of known) {
      if (itemMap[id] || scrollIds.has(id)) continue;
      if ((sources[id] || 'class') !== 'class') continue;
      const spell = pool.find(s => s.id === id);
      if (!spell) continue;
      spell.level === 0 ? cantrips++ : spells++;
    }
    return { cantrips, spells };
  }

  function isConcentration(spell) {
    return (spell.duration || '').toLowerCase().startsWith('concentration');
  }

  function rechargeItemSpells(recoveryTypes) {
    (character.inventoryWeapons || []).forEach(w => {
      (w.spells || []).forEach(sp => {
        if (recoveryTypes.includes(sp.recovery || 'Repos long')) sp.usesLeft = sp.uses || 1;
      });
    });
    (character.inventoryEquipment || []).forEach(item => {
      (item.spells || []).forEach(sp => {
        if (recoveryTypes.includes(sp.recovery || 'Repos long')) sp.usesLeft = sp.uses || 1;
      });
    });
  }

  function renderActiveSpells() {
    const bar = document.getElementById('active-spells-bar');
    const active = character.activeSpells || [];
    bar.classList.toggle('hidden', active.length === 0);
    if (active.length === 0) return;
    bar.innerHTML = '<span class="asb-label">En cours :</span>';
    active.forEach((sp, idx) => {
      const chip = document.createElement('div');
      chip.className = 'active-spell-chip' + (sp.concentration ? ' conc' : '');
      chip.innerHTML =
        (ORIGIN_ICONS[sp.origin] || '✨') + ' <strong>' + sp.name + '</strong>' +
        (sp.concentration ? ' <span class="conc-badge">Conc.</span>' : '') +
        ' <span class="asp-duration">' + (sp.duration || '') + '</span>' +
        ' <button class="btn-stop-spell" title="Désactiver">⏹</button>';
      chip.querySelector('.btn-stop-spell').addEventListener('click', e => {
        e.stopPropagation();
        character.activeSpells.splice(idx, 1);
        saveCharacter();
        renderActiveSpells();
        if (spellsCache) renderSpellsList();
      });
      bar.appendChild(chip);
    });
  }

  function performCast(spell, origin, itemEntries) {
    const conc = isConcentration(spell);
    const instant = (spell.duration || '').toLowerCase().trim() === 'instantanée';

    if (!character.activeSpells) character.activeSpells = [];
    if (conc) character.activeSpells = character.activeSpells.filter(s => !s.concentration);
    if (!instant) {
      character.activeSpells.push({ id: spell.id, name: spell.name, origin, concentration: conc, duration: spell.duration });
    }

    if (origin === 'class') {
      const slots = character.spellSlots || {};
      const used  = character.spellSlotsUsed || {};
      for (let lvl = spell.level; lvl <= 9; lvl++) {
        const key = String(lvl);
        if ((slots[key] || 0) > (used[key] || 0)) {
          if (!character.spellSlotsUsed) character.spellSlotsUsed = {};
          character.spellSlotsUsed[key] = (used[key] || 0) + 1;
          break;
        }
      }
    } else if (origin === 'scroll') {
      const idx = (character.spellScrolls || []).findIndex(s => s.id === spell.id);
      if (idx >= 0) {
        if ((character.spellScrolls[idx].qty || 1) <= 1) character.spellScrolls.splice(idx, 1);
        else character.spellScrolls[idx].qty--;
      }
    } else if (origin === 'item') {
      const entry = (itemEntries || []).find(e => e.usesLeft > 0 && e.recovery !== 'À volonté');
      if (entry) {
        const weapon = (character.inventoryWeapons || []).find(w => w.name === entry.source);
        if (weapon) { const sp = (weapon.spells || []).find(s => s.id === spell.id); if (sp) sp.usesLeft = Math.max(0, (sp.usesLeft ?? sp.uses) - 1); }
        const equip = (character.inventoryEquipment || []).find(i => i.name === entry.source);
        if (equip) { const sp = (equip.spells || []).find(s => s.id === spell.id); if (sp) sp.usesLeft = Math.max(0, (sp.usesLeft ?? sp.uses) - 1); }
      }
    }

    saveCharacter();
    renderSpellSlots();
    renderActiveSpells();
    if (spellsCache) renderSpellsList();
  }

  function castSpell(spell, origin, itemEntries) {
    const conc = isConcentration(spell);
    const activeConc = (character.activeSpells || []).find(s => s.concentration);
    if (conc && activeConc) {
      const modal = document.getElementById('conc-conflict-modal');
      document.getElementById('conc-current-name').textContent = activeConc.name;
      document.getElementById('conc-new-name').textContent = spell.name;
      document.getElementById('btn-conc-cancel').onclick = () => modal.classList.add('hidden');
      document.getElementById('btn-conc-replace').onclick = () => {
        modal.classList.add('hidden');
        performCast(spell, origin, itemEntries);
      };
      modal.classList.remove('hidden');
      return;
    }
    performCast(spell, origin, itemEntries);
  }

  function openSpellOriginPicker(spell, anchorBtn) {
    document.querySelectorAll('.spell-origin-picker').forEach(p => p.remove());
    const picker = document.createElement('div');
    picker.className = 'spell-origin-picker';

    // Check class limits for this spell
    const limits = getSpellLearnLimits();
    const counts = countClassSpells();
    let classBlocked = false;
    let classBlockMsg = '';
    if (limits) {
      if (spell.level === 0 && counts.cantrips >= limits.cantrips) {
        classBlocked = true;
        classBlockMsg = counts.cantrips + '/' + limits.cantrips + ' sorts mineurs';
      } else if (spell.level > 0 && counts.spells >= limits.spells) {
        classBlocked = true;
        classBlockMsg = counts.spells + '/' + limits.spells + ' sorts';
      }
    }

    [
      { val: 'class',      label: '🏛 Classe' },
      { val: 'race',       label: '🧬 Race' },
      { val: 'competence', label: '⭐ Compétence' },
      { val: 'item',       label: '💍 Objet' },
    ].forEach(o => {
      const isBlocked = o.val === 'class' && classBlocked;
      const btn = document.createElement('button');
      btn.className = 'spell-origin-opt' + (isBlocked ? ' spo-blocked' : '');
      btn.textContent = o.label + (isBlocked ? ' — limite atteinte (' + classBlockMsg + ')' : '');
      btn.disabled = isBlocked;
      if (!isBlocked) {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          addKnownSpell(spell.id, o.val);
          picker.remove();
        });
      }
      picker.appendChild(btn);
    });

    anchorBtn.closest('.spell-item').after(picker);
    setTimeout(() => document.addEventListener('click', () => picker.remove(), { once: true }), 0);
  }

  const ORIGIN_LABELS = { class: 'Classe', race: 'Race', competence: 'Compétence', item: 'Objet', scroll: 'Parchemin' };
  const ORIGIN_ICONS  = { class: '🏛',    race: '🧬',   competence: '⭐',          item: '💍',   scroll: '📜' };

  function renderSpellsList() {
    const $list = document.getElementById('spells-list');
    $list.innerHTML = '';

    if (!spellsCache || spellsCache.length === 0) {
      $list.innerHTML = '<p class="sf-empty">Aucun sort chargé. Ajoutez des sorts dans data/spells.json</p>';
      return;
    }

    const search      = (document.getElementById('spell-search').value || '').toLowerCase().trim();
    const known       = character.knownSpells || [];
    const scrollIds   = new Set((character.spellScrolls || []).map(s => s.id));
    const itemSpellMap = buildItemSpellMap();

    // Build the full spell pool: class spells + item spells + scroll spells + known spells not already present
    const extraIds = new Set([
      ...Object.keys(itemSpellMap),
      ...[...scrollIds],
      ...(known),
    ]);
    const missingSpells = [...extraIds].filter(id => !spellsCache.find(s => s.id === id));
    if (missingSpells.length > 0 && !allSpellsCache) {
      fetchAllSpells().then(() => renderSpellsList());
      return;
    }
    let spellPool = [...spellsCache];
    if (allSpellsCache) {
      missingSpells.forEach(id => {
        const spell = allSpellsCache.find(s => s.id === id);
        if (spell && !spellPool.find(s => s.id === id)) spellPool.push(spell);
      });
    }

    let filtered = spellPool.filter(spell => {
      if (search && !spell.name.toLowerCase().includes(search) && !(spell.nameVO || '').toLowerCase().includes(search)) return false;
      if (sfLevels.size > 0 && !sfLevels.has(spell.level)) return false;
      const isItemSpell = !!itemSpellMap[spell.id];
      const isKnown = known.includes(spell.id) || scrollIds.has(spell.id) || isItemSpell;
      if (sfKnown === 'known' && !isKnown) return false;
      if (sfKnown === 'known' && sfAvail === 'available' && !isSpellAvailable(spell, scrollIds, itemSpellMap)) return false;
      if (sfDamage === 'yes' && !spellHasDamage(spell)) return false;
      if (sfDamage === 'no'  &&  spellHasDamage(spell)) return false;
      if (sfKnown === 'known' && sfOrigin.size > 0) {
        const origin = scrollIds.has(spell.id) ? 'scroll' : isItemSpell ? 'item' : getSpellOrigin(spell.id);
        if (!sfOrigin.has(origin)) return false;
      }
      return true;
    });

    // Barre de limites de sorts de classe
    const limits = getSpellLearnLimits();
    if (limits) {
      const counts = countClassSpells();
      const cantripFull = counts.cantrips >= limits.cantrips;
      const spellFull   = counts.spells   >= limits.spells;
      const hasSlots    = !cantripFull || !spellFull;
      const bar = document.createElement('div');
      bar.className = 'spell-limits-bar' + (hasSlots ? ' slb-has-slots' : '');
      const countsDiv = document.createElement('div');
      countsDiv.className = 'slb-counts';
      countsDiv.innerHTML =
        '<span class="slb-item' + (cantripFull ? ' slb-full' : ' slb-avail') + '">' +
          'Sorts mineurs&nbsp;: <strong>' + counts.cantrips + '</strong>&nbsp;/&nbsp;' + limits.cantrips +
          (cantripFull ? ' — <em>limite atteinte</em>' : '') +
        '</span>' +
        '<span class="slb-sep">·</span>' +
        '<span class="slb-item' + (spellFull ? ' slb-full' : ' slb-avail') + '">' +
          'Sorts&nbsp;(niv.&nbsp;1+)&nbsp;: <strong>' + counts.spells + '</strong>&nbsp;/&nbsp;' + limits.spells +
          (spellFull ? ' — <em>limite atteinte</em>' : '') +
        '</span>';
      bar.appendChild(countsDiv);
      if (hasSlots) {
        const learnBtn = document.createElement('button');
        learnBtn.className = 'btn-learn-spells';
        learnBtn.textContent = '+ Apprendre des sorts';
        learnBtn.addEventListener('click', e => { e.stopPropagation(); openLearnSpellsModal(); });
        bar.appendChild(learnBtn);
      }
      $list.appendChild(bar);
    }

    const groups = {};
    for (const spell of filtered) {
      if (!groups[spell.level]) groups[spell.level] = [];
      groups[spell.level].push(spell);
    }

    const levels = Object.keys(groups).sort((a, b) => +a - +b);
    if (levels.length === 0) {
      $list.innerHTML += '<p class="sf-empty">Aucun sort ne correspond aux filtres.</p>';
      return;
    }

    for (const lvl of levels) {
      const lvlNum = parseInt(lvl, 10);
      const groupDiv = document.createElement('div');
      groupDiv.className = 'spell-level-group';

      const hdr = document.createElement('div');
      hdr.className = 'slg-header';
      hdr.innerHTML =
        '<h3>' + (lvlNum === 0 ? 'Sorts mineurs' : 'Niveau ' + lvl) + '</h3>' +
        '<span class="slg-count">' + groups[lvl].length + '</span>';
      groupDiv.appendChild(hdr);

      for (const spell of groups[lvl]) {
        const isKnown    = known.includes(spell.id);
        const isScroll   = scrollIds.has(spell.id);
        const isItemSpell = !!itemSpellMap[spell.id];
        const avail      = isSpellAvailable(spell, scrollIds, itemSpellMap);
        const origin     = isScroll ? 'scroll' : isItemSpell ? 'item' : getSpellOrigin(spell.id);

        const item = document.createElement('div');
        const dimmed = !avail && sfAvail === 'all' && sfKnown === 'known';
        item.className = 'spell-item' + (dimmed ? ' spell-unavailable' : '');

        const dot = document.createElement('div');
        dot.className = 'spell-lvl-dot' + (lvlNum === 0 ? ' dot-cantrip' : '');
        dot.textContent = lvlNum === 0 ? '✦' : lvl;

        const info = document.createElement('div');
        info.className = 'spell-info';
        let tagsHtml = '<span class="spell-tag-school">' + (spell.school || '') + '</span>';
        if ((isKnown || isScroll || isItemSpell) && sfKnown === 'known') {
          tagsHtml += '<span class="spell-tag-origin spo-' + origin + '">' + (ORIGIN_ICONS[origin] || '') + ' ' + (ORIGIN_LABELS[origin] || origin) + '</span>';
        }
        if (isItemSpell && sfKnown === 'known') {
          const sources = itemSpellMap[spell.id].map(e => e.source).join(', ');
          tagsHtml += '<span class="spell-tag-source">' + sources + '</span>';
        }
        if (spellHasDamage(spell)) tagsHtml += '<span class="spell-tag-damage">⚔️</span>';
        info.innerHTML = '<span class="spell-name">' + spell.name + '</span><div class="spell-tags">' + tagsHtml + '</div>';

        item.appendChild(dot);
        item.appendChild(info);

        if (isKnown && !isScroll && !isItemSpell) {
          const forgetBtn = document.createElement('button');
          forgetBtn.className = 'btn-spell-forget';
          forgetBtn.title = 'Oublier ce sort';
          forgetBtn.textContent = '✕';
          forgetBtn.addEventListener('click', e => { e.stopPropagation(); removeKnownSpell(spell.id); });
          item.appendChild(forgetBtn);
        } else if (!isKnown && !isScroll && !isItemSpell && sfKnown === 'all') {
          const learnBtn = document.createElement('button');
          learnBtn.className = 'btn-spell-learn';
          learnBtn.textContent = '+ Apprendre';
          learnBtn.addEventListener('click', e => { e.stopPropagation(); openSpellOriginPicker(spell, learnBtn); });
          item.appendChild(learnBtn);
        }

        if (spell.level > 0 && sfKnown === 'known' && (isKnown || isScroll || isItemSpell)) {
          const castBtn = document.createElement('button');
          castBtn.className = 'btn-cast-spell';
          castBtn.title = avail ? 'Lancer ce sort' : 'Sort indisponible';
          castBtn.textContent = '⚡';
          castBtn.disabled = !avail;
          castBtn.addEventListener('click', e => {
            e.stopPropagation();
            castSpell(spell, origin, isItemSpell ? itemSpellMap[spell.id] : null);
          });
          item.appendChild(castBtn);
        }

        item.addEventListener('click', () => showSpellModal(spell));
        groupDiv.appendChild(item);
      }

      $list.appendChild(groupDiv);
    }
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
  function initSpellFilters() {
    document.getElementById('spell-search').addEventListener('input', renderSpellsList);

    document.getElementById('sf-levels').addEventListener('click', e => {
      const btn = e.target.closest('.sf-chip');
      if (!btn) return;
      const val = btn.dataset.val;
      if (val === 'all') {
        sfLevels.clear();
      } else {
        const n = parseInt(val, 10);
        sfLevels.has(n) ? sfLevels.delete(n) : sfLevels.add(n);
      }
      document.querySelectorAll('#sf-levels .sf-chip').forEach(b => {
        b.classList.toggle('sf-on', b.dataset.val === 'all' ? sfLevels.size === 0 : sfLevels.has(parseInt(b.dataset.val, 10)));
      });
      renderSpellsList();
    });

    document.getElementById('sf-known').addEventListener('click', e => {
      const btn = e.target.closest('.sf-toggle');
      if (!btn) return;
      sfKnown = btn.dataset.val;
      document.querySelectorAll('#sf-known .sf-toggle').forEach(b => b.classList.toggle('sf-on', b.dataset.val === sfKnown));
      const originRow  = document.getElementById('sf-origin-row');
      const availGroup = document.getElementById('sf-avail-group');
      if (sfKnown === 'all') {
        originRow.classList.add('hidden');
        availGroup.classList.add('sf-disabled');
        sfAvail = 'all';
        document.querySelectorAll('#sf-avail .sf-toggle').forEach(b => b.classList.toggle('sf-on', b.dataset.val === 'all'));
      } else {
        originRow.classList.remove('hidden');
        availGroup.classList.remove('sf-disabled');
        sfAvail = 'available';
        document.querySelectorAll('#sf-avail .sf-toggle').forEach(b => b.classList.toggle('sf-on', b.dataset.val === 'available'));
      }
      renderSpellsList();
    });

    document.getElementById('sf-avail').addEventListener('click', e => {
      if (sfKnown === 'all') return;
      const btn = e.target.closest('.sf-toggle');
      if (!btn) return;
      sfAvail = btn.dataset.val;
      document.querySelectorAll('#sf-avail .sf-toggle').forEach(b => b.classList.toggle('sf-on', b.dataset.val === sfAvail));
      renderSpellsList();
    });

    document.getElementById('sf-damage').addEventListener('click', e => {
      const btn = e.target.closest('.sf-toggle');
      if (!btn) return;
      sfDamage = btn.dataset.val;
      document.querySelectorAll('#sf-damage .sf-toggle').forEach(b => b.classList.toggle('sf-on', b.dataset.val === sfDamage));
      renderSpellsList();
    });

    document.getElementById('sf-origin').addEventListener('click', e => {
      const btn = e.target.closest('.sf-chip');
      if (!btn) return;
      const val = btn.dataset.val;
      if (val === 'all') {
        sfOrigin.clear();
      } else {
        sfOrigin.has(val) ? sfOrigin.delete(val) : sfOrigin.add(val);
      }
      document.querySelectorAll('#sf-origin .sf-chip').forEach(b => {
        b.classList.toggle('sf-on', b.dataset.val === 'all' ? sfOrigin.size === 0 : sfOrigin.has(b.dataset.val));
      });
      renderSpellsList();
    });
  }
  initSpellFilters();

  // --- Learn spells modal ---

  async function openLearnSpellsModal() {
    if (!spellsCache) await loadSpells();
    lsSearch  = '';
    lsLevels  = new Set();
    lsDamage  = 'all';
    lsSelected = new Set();
    document.getElementById('learn-search').value = '';
    document.querySelectorAll('#learn-sf-levels .sf-chip').forEach(b =>
      b.classList.toggle('sf-on', b.dataset.val === 'all'));
    document.querySelectorAll('#learn-sf-damage .sf-toggle').forEach(b =>
      b.classList.toggle('sf-on', b.dataset.val === 'all'));
    document.getElementById('learn-spells-modal').classList.remove('hidden');
    updateLearnCount();
    renderLearnableSpells();
  }

  function updateLearnSlotsInfo() {
    const limits = getSpellLearnLimits();
    const el = document.getElementById('learn-slots-info');
    if (!el) return;
    if (!limits) { el.innerHTML = ''; return; }
    const counts = countClassSpells();
    const pool   = spellsCache || [];
    const cSel   = [...lsSelected].filter(id => { const s = pool.find(sp => sp.id === id); return s && s.level === 0; }).length;
    const sSel   = lsSelected.size - cSel;
    const cRemain = limits.cantrips - counts.cantrips - cSel;
    const sRemain = limits.spells   - counts.spells   - sSel;
    el.innerHTML =
      '<span class="lsi-item ' + (cRemain > 0 ? 'lsi-avail' : cRemain < 0 ? 'lsi-over' : 'lsi-exact') + '">' +
        'Sorts mineurs : ' + (counts.cantrips + cSel) + ' / ' + limits.cantrips +
        (cRemain > 0 ? ' — ' + cRemain + ' restant' + (cRemain > 1 ? 's' : '') : '') +
        (cRemain < 0 ? ' — ⚠ ' + (-cRemain) + ' de trop' : '') +
      '</span>' +
      '<span class="lsi-sep">·</span>' +
      '<span class="lsi-item ' + (sRemain > 0 ? 'lsi-avail' : sRemain < 0 ? 'lsi-over' : 'lsi-exact') + '">' +
        'Sorts : ' + (counts.spells + sSel) + ' / ' + limits.spells +
        (sRemain > 0 ? ' — ' + sRemain + ' restant' + (sRemain > 1 ? 's' : '') : '') +
        (sRemain < 0 ? ' — ⚠ ' + (-sRemain) + ' de trop' : '') +
      '</span>';
  }

  function updateLearnCount() {
    const n = lsSelected.size;
    const el = document.getElementById('learn-selected-count');
    if (el) el.textContent = n === 0 ? 'Aucun sort sélectionné' : n + ' sort' + (n > 1 ? 's' : '') + ' sélectionné' + (n > 1 ? 's' : '');
    const btn = document.getElementById('btn-learn-confirm');
    if (btn) btn.disabled = n === 0;
  }

  function renderLearnableSpells() {
    const $list = document.getElementById('learn-spells-list');
    if (!$list) return;
    $list.innerHTML = '';
    updateLearnSlotsInfo();

    const known   = new Set(character.knownSpells || []);
    const pool    = (spellsCache || []);
    const search  = lsSearch.toLowerCase().trim();

    const filtered = pool.filter(spell => {
      if (known.has(spell.id)) return false;
      if (search && !spell.name.toLowerCase().includes(search) && !(spell.nameVO || '').toLowerCase().includes(search)) return false;
      if (lsLevels.size > 0 && !lsLevels.has(spell.level)) return false;
      if (lsDamage === 'yes' && !spellHasDamage(spell)) return false;
      if (lsDamage === 'no'  &&  spellHasDamage(spell)) return false;
      return true;
    });

    if (filtered.length === 0) {
      $list.innerHTML = '<p class="sf-empty">Aucun sort disponible à l\'apprentissage.</p>';
      return;
    }

    const groups = {};
    for (const spell of filtered) {
      if (!groups[spell.level]) groups[spell.level] = [];
      groups[spell.level].push(spell);
    }

    const levels = Object.keys(groups).sort((a, b) => +a - +b);
    for (const lvl of levels) {
      const lvlNum = parseInt(lvl, 10);
      const groupDiv = document.createElement('div');
      groupDiv.className = 'spell-level-group';

      const hdr = document.createElement('div');
      hdr.className = 'slg-header';
      hdr.innerHTML =
        '<h3>' + (lvlNum === 0 ? 'Sorts mineurs' : 'Niveau ' + lvl) + '</h3>' +
        '<span class="slg-count">' + groups[lvl].length + '</span>';
      groupDiv.appendChild(hdr);

      for (const spell of groups[lvl]) {
        const isSelected = lsSelected.has(spell.id);
        const item = document.createElement('div');
        item.className = 'spell-item learn-spell-item' + (isSelected ? ' learn-selected' : '');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'learn-cb';
        cb.checked = isSelected;
        cb.addEventListener('change', e => {
          e.stopPropagation();
          if (cb.checked) lsSelected.add(spell.id);
          else lsSelected.delete(spell.id);
          item.classList.toggle('learn-selected', cb.checked);
          updateLearnCount();
          updateLearnSlotsInfo();
        });

        const dot = document.createElement('div');
        dot.className = 'spell-lvl-dot' + (lvlNum === 0 ? ' dot-cantrip' : '');
        dot.textContent = lvlNum === 0 ? '✦' : lvl;

        const info = document.createElement('div');
        info.className = 'learn-spell-info';

        const metaParts = [];
        if (spell.school)      metaParts.push('<span class="lsm-school">' + spell.school + '</span>');
        if (spell.castingTime) metaParts.push('<span>⏱ ' + spell.castingTime + '</span>');
        if (spell.range)       metaParts.push('<span>📍 ' + spell.range + '</span>');
        if (spell.duration)    metaParts.push('<span>⏳ ' + spell.duration + '</span>');
        if (spell.components)  metaParts.push('<span>' + spell.components + '</span>');

        let desc = (spell.description || '').replace(/\n{2,}/g, '\n').trim();
        if (spell.higherLevels) desc += '\n\nAux niveaux supérieurs : ' + spell.higherLevels;

        info.innerHTML =
          '<div class="learn-spell-header">' +
            '<span class="spell-name">' + spell.name + '</span>' +
            (isConcentration(spell) ? '<span class="learn-conc-badge">Conc.</span>' : '') +
            (spellHasDamage(spell)  ? '<span class="learn-dmg-badge">⚔️</span>'     : '') +
          '</div>' +
          (metaParts.length ? '<div class="learn-spell-meta">' + metaParts.join('') + '</div>' : '') +
          (desc ? '<div class="learn-spell-desc">' + desc.replace(/\n/g, '<br>') + '</div>' : '');

        item.appendChild(cb);
        item.appendChild(dot);
        item.appendChild(info);
        item.addEventListener('click', e => { if (e.target === cb) return; cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); });

        groupDiv.appendChild(item);
      }
      $list.appendChild(groupDiv);
    }
  }

  function initLearnModal() {
    const modal = document.getElementById('learn-spells-modal');
    document.getElementById('btn-learn-close').onclick  = () => modal.classList.add('hidden');
    document.getElementById('btn-learn-cancel').onclick = () => modal.classList.add('hidden');
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

    document.getElementById('btn-learn-confirm').onclick = () => {
      if (lsSelected.size === 0) return;
      if (!character.knownSpells)  character.knownSpells  = [];
      if (!character.spellSources) character.spellSources = {};
      for (const id of lsSelected) {
        if (!character.knownSpells.includes(id)) character.knownSpells.push(id);
        character.spellSources[id] = 'class';
      }
      saveCharacter();
      modal.classList.add('hidden');
      renderSpellsList();
    };

    document.getElementById('learn-search').addEventListener('input', e => {
      lsSearch = e.target.value;
      renderLearnableSpells();
    });

    document.getElementById('learn-sf-levels').addEventListener('click', e => {
      const btn = e.target.closest('.sf-chip');
      if (!btn) return;
      const val = btn.dataset.val;
      if (val === 'all') lsLevels.clear();
      else { const n = parseInt(val, 10); lsLevels.has(n) ? lsLevels.delete(n) : lsLevels.add(n); }
      document.querySelectorAll('#learn-sf-levels .sf-chip').forEach(b =>
        b.classList.toggle('sf-on', b.dataset.val === 'all' ? lsLevels.size === 0 : lsLevels.has(parseInt(b.dataset.val, 10))));
      renderLearnableSpells();
    });

    document.getElementById('learn-sf-damage').addEventListener('click', e => {
      const btn = e.target.closest('.sf-toggle');
      if (!btn) return;
      lsDamage = btn.dataset.val;
      document.querySelectorAll('#learn-sf-damage .sf-toggle').forEach(b =>
        b.classList.toggle('sf-on', b.dataset.val === lsDamage));
      renderLearnableSpells();
    });
  }
  initLearnModal();

  // --- Capacites ---
  // ---- Proficiency picker ----

  let profPickerOutsideHandler = null;
  let langEditMode = false;
  let profCollapsed      = true;
  let langCollapsed      = true;
  let traitsCollapsed    = true;
  let featuresCollapsed  = false;
  let cfTempChoices      = {};

  function getProfLeaves(node) {
    if (!node.children) return [node.label];
    return node.children.flatMap(getProfLeaves);
  }

  function expandProfValues(tree, stored) {
    const storedSet = new Set(stored);
    const checked = new Set();
    function walk(node) {
      if (storedSet.has(node.label)) { getProfLeaves(node).forEach(l => checked.add(l)); }
      else if (node.children) { node.children.forEach(walk); }
    }
    tree.forEach(walk);
    return checked;
  }

  function compactProfValues(tree, checkedLeaves) {
    const result = [];
    function walk(node) {
      const leaves = getProfLeaves(node);
      if (leaves.length > 0 && leaves.every(l => checkedLeaves.has(l))) {
        result.push(node.label);
      } else if (node.children) {
        node.children.forEach(walk);
      }
    }
    tree.forEach(walk);
    return result;
  }

  function closeProfPicker() {
    const p = document.getElementById('prof-picker');
    if (p) p.remove();
    if (profPickerOutsideHandler) {
      document.removeEventListener('click', profPickerOutsideHandler);
      profPickerOutsideHandler = null;
    }
  }

  function openBackgroundToolPicker(category, anchorEl) {
    const existing = document.querySelector('.bg-tool-picker');
    if (existing) { existing.remove(); return; }
    closeProfPicker();

    const catNode = PROF_TREES.tools.find(c => c.label === category);
    if (!catNode || !catNode.children) return;

    const picker = document.createElement('div');
    picker.className = 'bg-tool-picker';

    const title = document.createElement('div');
    title.className = 'bg-tool-picker-title';
    title.textContent = category;
    picker.appendChild(title);

    const scroll = document.createElement('div');
    scroll.className = 'bg-tool-picker-scroll';
    catNode.children.forEach(item => {
      const row = document.createElement('div');
      row.className = 'bg-tool-row';
      row.textContent = item.label;
      row.onclick = e => {
        e.stopPropagation();
        picker.remove();
        applyBackgroundToolChoice(item.label);
      };
      scroll.appendChild(row);
    });
    picker.appendChild(scroll);
    document.body.appendChild(picker);

    const rect = anchorEl.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    if (left + 220 > window.innerWidth) left = Math.max(8, window.innerWidth - 228);
    picker.style.top = (rect.bottom + window.scrollY + 4) + 'px';
    picker.style.left = left + 'px';

    setTimeout(() => {
      const outside = e => {
        if (!picker.contains(e.target) && !anchorEl.contains(e.target)) {
          picker.remove();
          document.removeEventListener('click', outside);
        }
      };
      document.addEventListener('click', outside);
    }, 50);
  }

  function openProfPicker(type, anchorEl) {
    if (document.getElementById('prof-picker')) { closeProfPicker(); return; }
    const tree = PROF_TREES[type];
    const stored = ((character.proficiencies || {})[type] || []);
    const checkedLeaves = expandProfValues(tree, stored);
    const allCbs = {};

    const picker = document.createElement('div');
    picker.id = 'prof-picker';
    picker.className = 'prof-picker';

    const scroll = document.createElement('div');
    scroll.className = 'prof-picker-scroll';

    function renderNode(node, parentLabel, level, container) {
      const group = document.createElement('div');
      group.className = 'pck-group pck-row-' + level;

      const row = document.createElement('label');
      row.className = 'pck-row';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.label = node.label;
      cb.dataset.parent = parentLabel;
      cb.dataset.isLeaf = node.children ? '0' : '1';
      cb.checked = !node.children && checkedLeaves.has(node.label);
      allCbs[node.label] = cb;

      row.appendChild(cb);
      const span = document.createElement('span');
      span.textContent = node.label;
      row.appendChild(span);
      group.appendChild(row);

      if (node.children) {
        const childDiv = document.createElement('div');
        childDiv.className = 'pck-children';
        node.children.forEach(child => renderNode(child, node.label, level + 1, childDiv));
        group.appendChild(childDiv);
      }
      container.appendChild(group);
    }

    tree.forEach(node => renderNode(node, '', 0, scroll));

    function updateParentState(parentCb) {
      const children = Object.values(allCbs).filter(c => c.dataset.parent === parentCb.dataset.label);
      if (!children.length) return;
      const checked = children.filter(c => c.checked && !c.indeterminate).length;
      const indet   = children.filter(c => c.indeterminate).length;
      if (checked === children.length) { parentCb.checked = true; parentCb.indeterminate = false; }
      else if (checked === 0 && indet === 0) { parentCb.checked = false; parentCb.indeterminate = false; }
      else { parentCb.checked = false; parentCb.indeterminate = true; }
    }

    function cascadeDown(label, state) {
      Object.values(allCbs).forEach(c => {
        if (c.dataset.parent === label) { c.checked = state; c.indeterminate = false; cascadeDown(c.dataset.label, state); }
      });
    }

    function propagateUp(label) {
      const cb = allCbs[label];
      if (!cb || !cb.dataset.parent) return;
      const parentCb = allCbs[cb.dataset.parent];
      if (!parentCb) return;
      updateParentState(parentCb);
      propagateUp(cb.dataset.parent);
    }

    // Init parent states bottom-up
    const levels = {};
    Object.values(allCbs).forEach(cb => {
      const lvl = parseInt(cb.closest('.pck-group')?.className.match(/pck-row-(\d)/)?.[1] || '0');
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(cb);
    });
    Object.keys(levels).sort((a, b) => b - a).forEach(lvl => {
      levels[lvl].forEach(cb => { if (cb.dataset.isLeaf === '0') updateParentState(cb); });
    });

    scroll.addEventListener('change', e => {
      const cb = e.target;
      if (!cb.matches('input[type="checkbox"]')) return;
      if (cb.dataset.isLeaf === '0') { cascadeDown(cb.dataset.label, cb.checked); cb.indeterminate = false; }
      propagateUp(cb.dataset.label);
    });

    picker.appendChild(scroll);

    const footer = document.createElement('div');
    footer.className = 'prof-picker-footer';
    const valBtn = document.createElement('button');
    valBtn.className = 'btn-primary';
    valBtn.textContent = 'Valider';
    valBtn.addEventListener('click', e => {
      e.stopPropagation();
      const leaves = new Set(Object.values(allCbs).filter(c => c.dataset.isLeaf === '1' && c.checked).map(c => c.dataset.label));
      if (!character.proficiencies) character.proficiencies = {};
      character.proficiencies[type] = compactProfValues(tree, leaves);
      saveCharacter();
      closeProfPicker();
      renderCapacites();
    });
    const canBtn = document.createElement('button');
    canBtn.className = 'btn-secondary';
    canBtn.textContent = 'Annuler';
    canBtn.addEventListener('click', e => { e.stopPropagation(); closeProfPicker(); });
    footer.appendChild(valBtn);
    footer.appendChild(canBtn);
    picker.appendChild(footer);
    document.body.appendChild(picker);

    const rect = anchorEl.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;
    if (left + 300 > window.innerWidth) left = Math.max(8, window.innerWidth - 308);
    picker.style.top = top + 'px';
    picker.style.left = left + 'px';

    setTimeout(() => {
      profPickerOutsideHandler = e => {
        if (!picker.contains(e.target) && !anchorEl.contains(e.target)) closeProfPicker();
      };
      document.addEventListener('click', profPickerOutsideHandler);
    }, 50);
  }

  // ---- Render Capacités ----

  function getToolCategory(label) {
    for (const cat of PROF_TREES.tools) {
      if (cat.label === label) return cat.label;
      if (cat.children) {
        for (const child of cat.children) {
          if (child.label === label) return cat.label;
        }
      }
    }
    return 'Autre';
  }

  function renderGroupedTools() {
    const container = document.getElementById('prof-tools-list');
    container.innerHTML = '';
    const tools = character.proficiencies.tools || [];
    const bgTools = character.backgroundTools || [];
    if (tools.length === 0) return;

    const groups = {};
    const catOrder = PROF_TREES.tools.map(c => c.label);
    catOrder.push('Autre');

    for (const tool of tools) {
      const cat = getToolCategory(tool);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(tool);
    }

    for (const catLabel of catOrder) {
      const items = groups[catLabel];
      if (!items || items.length === 0) continue;

      const group = document.createElement('div');
      group.className = 'tool-group';

      const header = document.createElement('div');
      header.className = 'tool-group-header';
      header.textContent = catLabel;
      group.appendChild(header);

      const list = document.createElement('div');
      list.className = 'tag-list';
      items.forEach((item) => {
        const fromBg = bgTools.includes(item);
        const tag = document.createElement('span');
        tag.className = 'tag';
        const badge = fromBg ? '<span class="skill-bg-badge">(Historique)</span>' : '';
        tag.innerHTML = item + badge + (fromBg ? '' : ' <button class="btn-remove">&times;</button>');
        if (!fromBg) {
          tag.querySelector('.btn-remove').addEventListener('click', () => {
            const idx = character.proficiencies.tools.indexOf(item);
            if (idx >= 0) character.proficiencies.tools.splice(idx, 1);
            saveCharacter();
            renderCapacites();
          });
        }
        list.appendChild(tag);
      });
      group.appendChild(list);
      container.appendChild(group);
    }
  }

  function renderLanguageTable() {
    if (!character.languages) character.languages = { spoken: [], scripts: [] };
    const spoken = character.languages.spoken || [];
    const scripts = character.languages.scripts || [];

    const container = document.getElementById('language-table-container');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'lang-table' + (langEditMode ? ' lang-edit-mode' : '');

    const thead = table.createTHead();
    const hRow = thead.insertRow();
    ['Langue', 'Écriture', 'Races typiques'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      hRow.appendChild(th);
    });

    const tbody = table.createTBody();

    function addSectionRow(label) {
      const row = tbody.insertRow();
      row.className = 'lang-section-row';
      const cell = row.insertCell();
      cell.colSpan = 3;
      cell.textContent = label;
    }

    function addLangRow(lang) {
      const row = tbody.insertRow();
      const isSpoken = spoken.includes(lang.name);
      const isScript = lang.script !== '—' && scripts.includes(lang.script);
      row.className = 'lang-row' + (isSpoken || isScript ? ' lang-known' : '');

      const tdLang = row.insertCell();
      tdLang.textContent = lang.name;
      tdLang.className = 'lang-cell' + (isSpoken ? ' lang-spoken' : '');
      if (langEditMode) {
        tdLang.classList.add('lang-clickable');
        tdLang.onclick = () => {
          if (!character.languages.spoken) character.languages.spoken = [];
          const idx = character.languages.spoken.indexOf(lang.name);
          if (idx >= 0) character.languages.spoken.splice(idx, 1);
          else character.languages.spoken.push(lang.name);
          saveCharacter();
          renderLanguageTable();
        };
      }

      const tdScript = row.insertCell();
      tdScript.textContent = lang.script;
      tdScript.className = 'lang-cell' + (isScript ? ' lang-script-known' : '');
      if (langEditMode && lang.script !== '—') {
        tdScript.classList.add('lang-clickable');
        tdScript.onclick = () => {
          if (!character.languages.scripts) character.languages.scripts = [];
          const idx = character.languages.scripts.indexOf(lang.script);
          if (idx >= 0) character.languages.scripts.splice(idx, 1);
          else character.languages.scripts.push(lang.script);
          saveCharacter();
          renderLanguageTable();
        };
      }

      const tdRaces = row.insertCell();
      tdRaces.textContent = lang.races;
      tdRaces.className = 'lang-cell lang-races';
    }

    addSectionRow('Langues standards');
    LANGUAGES_DATA.filter(l => !l.exotic).forEach(addLangRow);
    addSectionRow('Langues exotiques');
    LANGUAGES_DATA.filter(l => l.exotic).forEach(addLangRow);

    container.appendChild(table);

    const btn = document.getElementById('btn-lang-edit');
    btn.innerHTML = langEditMode ? '<span class="ic-confirm">✓</span>' : '<span class="ic-pencil">✏</span>';
    btn.title = langEditMode ? 'Terminer' : 'Modifier';
    btn.classList.toggle('active', langEditMode);
  }

  function renderCapacites() {
    if (!character.proficiencies) character.proficiencies = {};

    [
      { key: 'weapons', listId: 'prof-weapons-list', btnId: 'btn-add-prof-weapons' },
      { key: 'armor',   listId: 'prof-armor-list',   btnId: 'btn-add-prof-armor' },
    ].forEach(({ key, listId, btnId }) => {
      renderTagList(listId, character.proficiencies[key] || [], 'proficiencies.' + key);
      const btn = document.getElementById(btnId);
      btn.onclick = e => { e.stopPropagation(); openProfPicker(key, btn); };
    });

    renderGroupedTools();
    const $toolsBlock = document.getElementById('prof-block-tools');
    const pending = character.backgroundToolChoice || null;
    $toolsBlock.classList.toggle('tools-pending', !!pending);
    let $hint = $toolsBlock.querySelector('.tools-pending-hint');
    if (pending) {
      if (!$hint) { $hint = document.createElement('div'); $hint.className = 'tools-pending-hint'; $toolsBlock.appendChild($hint); }
      $hint.textContent = '⚠ Maîtrise à choisir : ' + pending;
    } else if ($hint) {
      $hint.remove();
    }
    const $btnTools = document.getElementById('btn-add-prof-tools');
    $btnTools.onclick = e => {
      e.stopPropagation();
      if (pending) openBackgroundToolPicker(pending, $btnTools);
      else openProfPicker('tools', $btnTools);
    };

    // Collapsible: Maîtrises
    document.getElementById('prof-toggle').textContent = profCollapsed ? '▶' : '▼';
    document.getElementById('proficiencies-body').classList.toggle('hidden', profCollapsed);

    // Collapsible: Langues
    document.getElementById('lang-toggle').textContent = langCollapsed ? '▶' : '▼';
    document.getElementById('languages-body').classList.toggle('hidden', langCollapsed);
    if (!langCollapsed) {
      renderLanguageTable();
      document.getElementById('btn-lang-edit').onclick = () => {
        langEditMode = !langEditMode;
        renderLanguageTable();
      };
    }

    // Collapsible: Traits raciaux
    document.getElementById('traits-racial-toggle').textContent = traitsCollapsed ? '▶' : '▼';
    document.getElementById('traits-racial-body').classList.toggle('hidden', traitsCollapsed);

    // Traits raciaux (auto depuis race)
    const $traitsList = document.getElementById('traits-list');
    $traitsList.innerHTML = '';
    const traits = character.traits || [];
    if (traits.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'text-dim';
      empty.textContent = character.race ? 'Aucun trait racial défini pour cette race.' : 'Sélectionne une race dans le profil.';
      $traitsList.appendChild(empty);
    } else {
      const traitDetails = getRaceTraitDetails(character.race);
      traits.forEach(t => {
        const detail = traitDetails.find(d => d.name === t);
        const item = document.createElement('div');
        item.className = 'trait-racial-item' + (detail ? ' trait-expandable' : '');

        const header = document.createElement('div');
        header.className = 'trait-racial-header';
        header.textContent = t;
        item.appendChild(header);

        if (detail && detail.desc) {
          const descEl = document.createElement('div');
          descEl.className = 'trait-racial-desc hidden';
          descEl.textContent = detail.desc;
          item.appendChild(descEl);

          header.addEventListener('click', () => {
            descEl.classList.toggle('hidden');
            item.classList.toggle('trait-open');
          });
        }

        $traitsList.appendChild(item);
      });
    }

    // Capacités de classe : collapsible
    document.getElementById('features-toggle').textContent = featuresCollapsed ? '▶' : '▼';
    document.getElementById('features-body').classList.toggle('hidden', featuresCollapsed);

    if (!featuresCollapsed) {
      const cls   = character.class || '';
      const level = character.level || 1;
      const allFeats = getClassFeatureList(cls, level);
      const choices  = character.classFeatureChoices || {};
      const $autoList = document.getElementById('class-features-auto');
      $autoList.innerHTML = '';

      const seenMulti = new Set();
      for (const f of allFeats) {
        if (f.t === 'multi-more') continue;
        const id = f.id || f.name;
        if (f.t === 'multi' && seenMulti.has(id)) continue;
        if (f.t === 'multi') seenMulti.add(id);

        const row = document.createElement('div');
        row.className = 'class-feature-item';
        const lvlSpan = '<span class="cf-level">Niv.' + f.l + '</span>';

        if (f.t === 'auto') {
          row.innerHTML = lvlSpan + '<span class="cf-name">' + f.name + '</span>';
        } else if (f.t === 'asi') {
          row.innerHTML = lvlSpan + '<span class="cf-name cf-asi">' + f.name + '</span>';
        } else if (f.t === 'choice') {
          const chosen = choices[id];
          if (chosen) {
            row.innerHTML = lvlSpan + '<span class="cf-name">' + f.name + ' : <strong>' + chosen + '</strong></span>';
          } else {
            row.innerHTML = lvlSpan + '<span class="cf-name cf-pending">' + f.name + ' — à choisir</span>';
          }
        } else if (f.t === 'multi') {
          const total  = getMultiTotalCount(allFeats, id);
          const chosen = choices[id] || [];
          if (chosen.length > 0) {
            const extra = chosen.length < total ? ' <span class="cf-pending-small">(+' + (total - chosen.length) + ' à choisir)</span>' : '';
            row.innerHTML = lvlSpan + '<span class="cf-name">' + f.name + ' : <strong>' + chosen.join(', ') + '</strong>' + extra + '</span>';
          } else {
            row.innerHTML = lvlSpan + '<span class="cf-name cf-pending">' + f.name + ' (' + total + ' à choisir)</span>';
          }
        }
        $autoList.appendChild(row);
      }

      // Typed features (patron, manifestations, faveur de pacte…)
      const typedData = getTypedFeatures(cls);
      if (typedData) {
        const tChoices = character.classFeatureChoices || {};
        for (const type of typedData.types) {
          if (type.grantedAt > level) continue;
          const row = document.createElement('div');
          row.className = 'class-feature-item';
          const lvlSpan = '<span class="cf-level">Niv.' + type.grantedAt + '</span>';
          if (type.selectionType === 'single') {
            const chosenId  = tChoices[type.id];
            const chosenOpt = chosenId ? type.options.find(o => o.id === chosenId) : null;
            if (chosenOpt) {
              row.innerHTML = lvlSpan + '<span class="cf-name">' + type.name + ' : <strong>' + chosenOpt.name + '</strong></span>';
            } else {
              row.innerHTML = lvlSpan + '<span class="cf-name cf-pending">' + type.name + ' — à choisir</span>';
            }
          } else if (type.selectionType === 'multi') {
            const need = computeMultiCount(type, level);
            const chosen = tChoices[type.id] || [];
            if (chosen.length > 0) {
              const extra = chosen.length < need ? ' <span class="cf-pending-small">(+' + (need - chosen.length) + ' à choisir)</span>' : '';
              const names = chosen.map(id => { const o = type.options.find(x => x.id === id); return o ? o.name : id; });
              row.innerHTML = lvlSpan + '<span class="cf-name">' + type.name + ' : <strong>' + names.join(', ') + '</strong>' + extra + '</span>';
            } else {
              row.innerHTML = lvlSpan + '<span class="cf-name cf-pending">' + type.name + ' (' + need + ' à choisir)</span>';
            }
          }
          $autoList.appendChild(row);
        }
      }

      if (!cls) {
        $autoList.innerHTML = '<span class="text-dim">Sélectionne une classe dans le profil.</span>';
      }

      // Bouton — toujours visible si classe connue
      const pendingCount = getPendingChoicesCount(cls, level);
      const $pendingBtn = document.getElementById('btn-cf-choose');
      if (cls) {
        $pendingBtn.classList.remove('hidden');
        if (pendingCount > 0) {
          $pendingBtn.className = 'btn-cf-pending';
          $pendingBtn.textContent = '⚠ ' + pendingCount + ' choix de capacité' + (pendingCount > 1 ? 's' : '') + ' en attente';
        } else {
          $pendingBtn.className = 'btn-cf-edit';
          $pendingBtn.textContent = '✏ Modifier les choix';
        }
      } else {
        $pendingBtn.classList.add('hidden');
      }
    }

    renderTagList('features-list', character.classFeatures || [], 'classFeatures');

    const $notes = document.getElementById('notes');
    $notes.value = character.notes || '';
    $notes.onchange = () => {
      character.notes = $notes.value;
      saveCharacter();
    };

    document.getElementById('btn-add-feature').onclick = () => addTag('feature-input', 'classFeatures');
  }

  function resolveField(field) {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return character[parent][child];
    }
    return character[field];
  }

  function renderTagList(containerId, items, field) {
    const $container = document.getElementById(containerId);
    $container.innerHTML = '';
    items.forEach((item, i) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = item + ' <button class="btn-remove">&times;</button>';
      tag.querySelector('.btn-remove').addEventListener('click', () => {
        resolveField(field).splice(i, 1);
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

    const invType = key === 'wristLeft' || key === 'wristRight' ? 'wrist' :
                    key === 'fingerLeft' || key === 'fingerRight' ? 'finger' : key;
    const myName = character.equipmentSlots[key] || '';

    const div = document.createElement('div');
    div.className = 'equip-slot' + (myName ? ' equip-slot-filled' : '');
    div.innerHTML =
      '<span class="equip-slot-icon">' + icon + '</span>' +
      '<span class="equip-slot-label">' + label + '</span>' +
      '<div class="hand-slot-picker">' +
        '<span class="hand-slot-name">' + (myName || '—') + '</span>' +
        '<button class="btn-hand-pick">▾</button>' +
        (myName ? '<button class="btn-hand-clear">✕</button>' : '') +
      '</div>';

    div.querySelector('.btn-hand-pick').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.hand-slot-dropdown').forEach(d => d.remove());
      const dropdown = document.createElement('div');
      dropdown.className = 'hand-slot-dropdown';

      const items = (character.inventoryEquipment || []).filter(it => it.slotType === invType);
      if (items.length === 0) {
        dropdown.innerHTML = '<div class="hand-drop-empty">Aucun objet de ce type dans l\'inventaire</div>';
      } else {
        items.forEach(it => {
          const opt = document.createElement('div');
          opt.className = 'hand-drop-item' + (it.name === myName ? ' selected' : '');
          let detail = '';
          if (it.slotType === 'chest' && it.baseCA) detail = 'CA ' + (it.baseCA + (it.armorBonus || 0));
          else if (it.slotType === 'shield' && it.shieldBonus) detail = '+' + it.shieldBonus + ' CA';
          opt.innerHTML = '<span>' + it.name + '</span>' + (detail ? '<span class="hand-drop-tag">' + detail + '</span>' : '');
          opt.addEventListener('click', () => {
            character.equipmentSlots[key] = it.name;
            saveCharacter();
            renderInventaire();
            dropdown.remove();
          });
          dropdown.appendChild(opt);
        });
      }

      div.appendChild(dropdown);
      setTimeout(() => document.addEventListener('click', () => dropdown.remove(), { once: true }), 0);
    });

    const clearBtn = div.querySelector('.btn-hand-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        character.equipmentSlots[key] = '';
        saveCharacter();
        renderInventaire();
      });
    }
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
        const equipped = !!(character.handSlots && (character.handSlots.left === w.name || character.handSlots.right === w.name));

        // Tags dégâts : base + bonus
        let dmgTags = '';
        if (w.baseDamage) dmgTags += '<span class="wtag wtag-dmg">' + w.baseDamage + ' ' + (wt.baseDmg || '') + '</span>';
        else if (wt.baseDmg) dmgTags += '<span class="wtag wtag-dmg">' + wt.baseDmg + '</span>';
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
        if (w.type && !hasWeaponProficiency(w.type)) propTags += '<span class="wtag wtag-danger">Non maîtrisé</span>';

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
          quickEquipWeapon(w);
        });
        row.addEventListener('click', () => openWeaponDetail(i));
        $wlist.appendChild(row);
      });
    }
    document.getElementById('btn-add-weapon-inv').onclick = () => openWeaponModal(null);

    // Équipement inventaire
    if (!character.inventoryEquipment) character.inventoryEquipment = [];
    const $einvlist = document.getElementById('equip-inv-list');
    $einvlist.innerHTML = '';
    document.getElementById('equip-inv-toggle').textContent = equipCollapsed ? '▶' : '▼';
    document.getElementById('equip-inv-body').classList.toggle('hidden', equipCollapsed);
    if (!equipCollapsed) {
      character.inventoryEquipment.forEach((item, i) => {
        const slotDef = EQUIPMENT_SLOT_TYPES.find(s => s.key === item.slotType) || { icon: '🎒', label: '' };
        const equipped = item.slotType === 'shield'
          ? !!(character.handSlots && (character.handSlots.left === item.name || character.handSlots.right === item.name))
          : Object.values(character.equipmentSlots || {}).some(v => v === item.name);

        let tags = '';
        if (item.slotType === 'chest' && item.baseCA) tags += '<span class="wtag wtag-bonus">CA ' + (item.baseCA + (item.armorBonus || 0)) + (item.armorBonus ? ' (+' + item.armorBonus + ')' : '') + '</span>';
        if (item.slotType === 'shield' && item.shieldBonus) tags += '<span class="wtag wtag-bonus">+' + item.shieldBonus + ' CA</span>';
        (item.statBonuses || []).forEach(b => {
          if (b.stat && b.amount) tags += '<span class="wtag wtag-prop">+' + b.amount + ' ' + (STATS[b.stat] || b.stat) + '</span>';
        });
        (item.skillBonuses || []).forEach(b => {
          if (b.skill && b.bonus) tags += '<span class="wtag wtag-prop">+' + b.bonus + ' ' + b.skill + '</span>';
        });
        if (item.spells && item.spells.length) tags += '<span class="wtag wtag-spell">✨ ' + item.spells.length + ' sort' + (item.spells.length > 1 ? 's' : '') + '</span>';

        const row = document.createElement('div');
        row.className = 'weapon-inv-row' + (equipped ? ' weapon-equipped' : '');
        row.innerHTML =
          '<span class="weapon-inv-icon">' + slotDef.icon + '</span>' +
          '<div class="weapon-inv-body">' +
            '<div class="weapon-inv-top">' +
              '<span class="weapon-inv-name">' + item.name + '</span>' +
              (slotDef.label ? '<span class="weapon-inv-type">' + slotDef.label + '</span>' : '') +
              '<button class="btn-weapon-equip' + (equipped ? ' is-equipped' : '') + '" data-i="' + i + '" title="' + (equipped ? 'Équipé — cliquer pour retirer' : 'Non équipé — cliquer pour équiper') + '">' +
                (equipped ? '✅' : '○') +
              '</button>' +
            '</div>' +
            (tags ? '<div class="weapon-inv-tags">' + tags + '</div>' : '') +
          '</div>';

        row.querySelector('.btn-weapon-equip').addEventListener('click', (e) => {
          e.stopPropagation();
          quickEquipEquipItem(item);
        });
        row.addEventListener('click', () => openEquipDetail(i));
        $einvlist.appendChild(row);
      });
    }
    document.getElementById('btn-add-equip-inv').onclick = () => openEquipModal(null);

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
  function hasWeaponProficiency(typeName) {
    if (!typeName) return true;
    const wt = WEAPON_TYPES.find(t => t.name === typeName);
    if (!wt) return true;
    const profs = ((character.proficiencies && character.proficiencies.weapons) || []).map(p => p.toLowerCase());
    if (profs.includes(typeName.toLowerCase())) return true;
    const cat = wt.cat.toLowerCase();
    if (profs.includes('armes de guerre')) return true;
    if (profs.includes('armes courantes') && cat.includes('courante')) return true;
    return false;
  }

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

  document.getElementById('prof-header').addEventListener('click', () => {
    profCollapsed = !profCollapsed;
    renderCapacites();
  });

  document.getElementById('lang-header').addEventListener('click', () => {
    langCollapsed = !langCollapsed;
    renderCapacites();
  });

  document.getElementById('traits-racial-header').addEventListener('click', () => {
    traitsCollapsed = !traitsCollapsed;
    renderCapacites();
  });

  document.getElementById('features-header').addEventListener('click', () => {
    featuresCollapsed = !featuresCollapsed;
    renderCapacites();
  });

  document.getElementById('btn-cf-choose').addEventListener('click', () => {
    openClassFeaturesModal();
  });

  document.getElementById('btn-cf-cancel').addEventListener('click', () => {
    document.getElementById('class-features-modal').classList.add('hidden');
  });

  document.getElementById('btn-cf-close').addEventListener('click', () => {
    document.getElementById('class-features-modal').classList.add('hidden');
  });

  document.getElementById('btn-cf-confirm').addEventListener('click', () => {
    character.classFeatureChoices = cfTempChoices;
    saveCharacter();
    document.getElementById('class-features-modal').classList.add('hidden');
    renderCapacites();
  });

  function getClassFeatureDesc(cls, featureName) {
    if (!classesCache || !cls) return null;
    const key = getClassKey(cls);
    const clsData = key ? classesCache[key] : null;
    if (!clsData) return null;
    const feat = clsData.features.find(f => f.name.toLowerCase() === featureName.toLowerCase());
    return feat ? feat.desc : null;
  }

  function openClassFeaturesModal() {
    const cls   = character.class || '';
    const level = character.level || 1;
    const allFeats = getClassFeatureList(cls, level);
    cfTempChoices  = JSON.parse(JSON.stringify(character.classFeatureChoices || {}));

    const body = document.getElementById('cf-modal-body');
    body.innerHTML = '';

    // Collect choice/multi features deduplicated, grouped by level
    const seenMulti = new Set();
    const byLevel = {};
    for (const f of allFeats) {
      if (f.t !== 'choice' && f.t !== 'multi') continue;
      if (f.t === 'multi-more') continue;
      const id = f.id || f.name;
      if (f.t === 'multi' && seenMulti.has(id)) continue;
      if (f.t === 'multi') seenMulti.add(id);
      if (!byLevel[f.l]) byLevel[f.l] = [];
      byLevel[f.l].push(f);
    }

    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
    for (const lvl of levels) {
      const grp = document.createElement('div');
      grp.className = 'cf-level-group';
      const hdr = document.createElement('div');
      hdr.className = 'cf-level-header';
      hdr.textContent = 'Niveau ' + lvl;
      grp.appendChild(hdr);

      for (const f of byLevel[lvl]) {
        const id = f.id || f.name;
        const block = document.createElement('div');
        block.className = 'cf-feature-choice';

        const cfDesc = CF_DESCS[id] || {};

        if (f.t === 'choice') {
          const current = cfTempChoices[id] || null;
          const title = document.createElement('div');
          title.className = 'cf-feature-name';
          title.textContent = f.name;
          block.appendChild(title);
          const featureDesc = getClassFeatureDesc(cls, f.name) || cfDesc.desc || null;
          if (featureDesc) {
            const descEl = document.createElement('div');
            descEl.className = 'cf-feature-desc';
            descEl.textContent = featureDesc;
            block.appendChild(descEl);
          }
          const optDiv = document.createElement('div');
          optDiv.className = 'cf-options';
          f.opts.forEach(opt => {
            const lbl = document.createElement('label');
            lbl.className = 'cf-option' + (opt === current ? ' cf-option-checked' : '');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'cf-' + id;
            radio.value = opt;
            radio.checked = opt === current;
            radio.addEventListener('change', () => {
              cfTempChoices[id] = opt;
              optDiv.querySelectorAll('.cf-option').forEach(l => l.classList.remove('cf-option-checked'));
              lbl.classList.add('cf-option-checked');
            });
            lbl.appendChild(radio);
            const optTextWrap = document.createElement('span');
            optTextWrap.className = 'cf-opt-content';
            const optName = document.createElement('span');
            optName.className = 'cf-opt-name';
            optName.textContent = opt;
            optTextWrap.appendChild(optName);
            const optD = cfDesc.opts && cfDesc.opts[opt];
            if (optD) {
              const optDesc = document.createElement('span');
              optDesc.className = 'cf-opt-desc';
              optDesc.textContent = optD;
              optTextWrap.appendChild(optDesc);
            }
            lbl.appendChild(optTextWrap);
            optDiv.appendChild(lbl);
          });
          block.appendChild(optDiv);

        } else if (f.t === 'multi') {
          const total   = getMultiTotalCount(allFeats, id);
          const current = cfTempChoices[id] ? [...cfTempChoices[id]] : [];
          if (!cfTempChoices[id]) cfTempChoices[id] = current;

          const title = document.createElement('div');
          title.className = 'cf-feature-name';
          title.innerHTML = f.name + ' <span class="cf-count-hint">(choisir ' + total + ')</span>';
          block.appendChild(title);
          const featureDesc = getClassFeatureDesc(cls, f.name) || cfDesc.desc || null;
          if (featureDesc) {
            const descEl = document.createElement('div');
            descEl.className = 'cf-feature-desc';
            descEl.textContent = featureDesc;
            block.appendChild(descEl);
          }

          const counter = document.createElement('div');
          counter.className = 'cf-selected-count';
          counter.textContent = current.length + ' / ' + total + ' sélectionnés';
          block.appendChild(counter);

          const optDiv = document.createElement('div');
          optDiv.className = 'cf-options';
          f.opts.forEach(opt => {
            const lbl = document.createElement('label');
            lbl.className = 'cf-option' + (current.includes(opt) ? ' cf-option-checked' : '');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = opt;
            cb.checked = current.includes(opt);
            cb.addEventListener('change', () => {
              const arr = cfTempChoices[id];
              if (cb.checked) {
                if (arr.length >= total) { cb.checked = false; return; }
                arr.push(opt);
                lbl.classList.add('cf-option-checked');
              } else {
                const idx = arr.indexOf(opt);
                if (idx >= 0) arr.splice(idx, 1);
                lbl.classList.remove('cf-option-checked');
              }
              counter.textContent = arr.length + ' / ' + total + ' sélectionnés';
            });
            lbl.appendChild(cb);
            const optTextWrap = document.createElement('span');
            optTextWrap.className = 'cf-opt-content';
            const optName = document.createElement('span');
            optName.className = 'cf-opt-name';
            optName.textContent = opt;
            optTextWrap.appendChild(optName);
            const optD = cfDesc.opts && cfDesc.opts[opt];
            if (optD) {
              const optDesc = document.createElement('span');
              optDesc.className = 'cf-opt-desc';
              optDesc.textContent = optD;
              optTextWrap.appendChild(optDesc);
            }
            lbl.appendChild(optTextWrap);
            optDiv.appendChild(lbl);
          });
          block.appendChild(optDiv);
        }

        grp.appendChild(block);
      }
      body.appendChild(grp);
    }

    // Typed features sections (patron, manifestations, faveur de pacte…)
    const typedData = getTypedFeatures(cls);
    if (typedData) {
      for (const type of typedData.types) {
        if (type.grantedAt > level) continue;

        const grp = document.createElement('div');
        grp.className = 'cf-level-group';
        const hdr = document.createElement('div');
        hdr.className = 'cf-level-header';
        hdr.textContent = 'Niveau ' + type.grantedAt;
        grp.appendChild(hdr);

        const block = document.createElement('div');
        block.className = 'cf-feature-choice';

        if (type.selectionType === 'single') {
          const currentId = cfTempChoices[type.id] || null;
          const title = document.createElement('div');
          title.className = 'cf-feature-name';
          title.textContent = type.name;
          block.appendChild(title);

          const optDiv = document.createElement('div');
          optDiv.className = 'cf-options';
          type.options.forEach(opt => {
            const lbl = document.createElement('label');
            lbl.className = 'cf-option' + (opt.id === currentId ? ' cf-option-checked' : '');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'cf-typed-' + type.id;
            radio.value = opt.id;
            radio.checked = opt.id === currentId;
            radio.addEventListener('change', () => {
              cfTempChoices[type.id] = opt.id;
              optDiv.querySelectorAll('.cf-option').forEach(l => l.classList.remove('cf-option-checked'));
              lbl.classList.add('cf-option-checked');
            });
            lbl.appendChild(radio);
            const wrap = document.createElement('span');
            wrap.className = 'cf-opt-content';
            const nameEl = document.createElement('span');
            nameEl.className = 'cf-opt-name';
            nameEl.textContent = opt.name;
            wrap.appendChild(nameEl);
            if (opt.desc) {
              const descEl = document.createElement('span');
              descEl.className = 'cf-opt-desc';
              descEl.textContent = opt.desc;
              wrap.appendChild(descEl);
            }
            if (opt.features && opt.features.length > 0) {
              const visFeats = opt.features.filter(f => f.l <= level);
              if (visFeats.length > 0) {
                const featsEl = document.createElement('div');
                featsEl.className = 'cf-opt-features';
                visFeats.forEach(f => {
                  const fDiv = document.createElement('div');
                  fDiv.className = 'cf-opt-feature-item';
                  fDiv.innerHTML = '<span class="cf-level">Niv.' + f.l + '</span> <strong>' + f.name + '</strong> — ' + f.desc;
                  featsEl.appendChild(fDiv);
                });
                wrap.appendChild(featsEl);
              }
            }
            lbl.appendChild(wrap);
            optDiv.appendChild(lbl);
          });
          block.appendChild(optDiv);

        } else if (type.selectionType === 'multi') {
          const need = computeMultiCount(type, level);
          if (!cfTempChoices[type.id]) cfTempChoices[type.id] = [];
          const current = cfTempChoices[type.id];

          const title = document.createElement('div');
          title.className = 'cf-feature-name';
          title.innerHTML = type.name + ' <span class="cf-count-hint">(choisir ' + need + ')</span>';
          block.appendChild(title);

          const counter = document.createElement('div');
          counter.className = 'cf-selected-count';
          counter.textContent = current.length + ' / ' + need + ' sélectionnés';
          block.appendChild(counter);

          const optDiv = document.createElement('div');
          optDiv.className = 'cf-options';
          type.options.forEach(opt => {
            const lbl = document.createElement('label');
            lbl.className = 'cf-option' + (current.includes(opt.id) ? ' cf-option-checked' : '');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = opt.id;
            cb.checked = current.includes(opt.id);
            cb.addEventListener('change', () => {
              const arr = cfTempChoices[type.id];
              if (cb.checked) {
                if (arr.length >= need) { cb.checked = false; return; }
                arr.push(opt.id);
                lbl.classList.add('cf-option-checked');
              } else {
                const idx = arr.indexOf(opt.id);
                if (idx >= 0) arr.splice(idx, 1);
                lbl.classList.remove('cf-option-checked');
              }
              counter.textContent = arr.length + ' / ' + need + ' sélectionnés';
            });
            lbl.appendChild(cb);
            const wrap = document.createElement('span');
            wrap.className = 'cf-opt-content';
            const nameEl = document.createElement('span');
            nameEl.className = 'cf-opt-name';
            nameEl.textContent = opt.name;
            wrap.appendChild(nameEl);
            if (opt.desc) {
              const descEl = document.createElement('span');
              descEl.className = 'cf-opt-desc';
              descEl.textContent = opt.desc;
              wrap.appendChild(descEl);
            }
            lbl.appendChild(wrap);
            optDiv.appendChild(lbl);
          });
          block.appendChild(optDiv);
        }

        grp.appendChild(block);
        body.appendChild(grp);
      }
    }

    if (levels.length === 0 && !typedData) {
      body.innerHTML = '<span class="text-dim">Aucun choix disponible pour cette classe et ce niveau.</span>';
    }

    document.getElementById('class-features-modal').classList.remove('hidden');
  }

  document.getElementById('weapons-inv-header').addEventListener('click', () => {
    weaponsInvCollapsed = !weaponsInvCollapsed;
    renderInventaire();
  });

  document.getElementById('equip-inv-header').addEventListener('click', () => {
    equipCollapsed = !equipCollapsed;
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

    // Dés de base (depuis weapons.json)
    const $bdmg = document.getElementById('wm-base-dmg');
    if ($bdmg) {
      const existingBd = w ? (w.baseDamage || '') : '';
      const wt = WEAPON_TYPES.find(t => t.name === selType);
      if (existingBd && wt) {
        $bdmg.textContent = 'Dés de base : ' + existingBd + ' ' + (wt.baseDmg || '');
        $bdmg.dataset.value = existingBd;
        $bdmg.classList.remove('hidden');
      } else {
        $bdmg.textContent = '';
        $bdmg.dataset.value = '';
        $bdmg.classList.add('hidden');
      }
    }

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
          // Auto-fill base damage from weapons cache
          const wd = weaponsCache ? weaponsCache[wt.name] : null;
          const $bdmg = document.getElementById('wm-base-dmg');
          if ($bdmg) {
            if (wd && wd.damage && wd.damage !== '—') {
              $bdmg.textContent = 'Dés de base : ' + wd.damage + ' ' + (wt.baseDmg || '');
              $bdmg.dataset.value = wd.damage;
              $bdmg.classList.remove('hidden');
            } else {
              $bdmg.textContent = '';
              $bdmg.dataset.value = '';
              $bdmg.classList.add('hidden');
            }
          }
          // Auto-fill properties
          if (wd && wd.properties && wd.properties.length > 0) renderWmProperties(wd.properties);
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
    const baseDamage = (document.getElementById('wm-base-dmg') || {}).dataset?.value || '';
    const weapon = { name, type, hands, atkBonus, baseDamage, damageBonus, properties, spells, desc, equipped };

    if (!character.inventoryWeapons) character.inventoryWeapons = [];
    if (weaponEditIndex !== null) {
      const oldWName = character.inventoryWeapons[weaponEditIndex].name;
      weapon.spells = spells.map((s, si) => ({ ...s, usesLeft: character.inventoryWeapons[weaponEditIndex].spells?.[si]?.usesLeft ?? s.uses }));
      character.inventoryWeapons[weaponEditIndex] = weapon;
      if (oldWName !== name && character.handSlots) {
        if (character.handSlots.left  === oldWName) character.handSlots.left  = name;
        if (character.handSlots.right === oldWName) character.handSlots.right = name;
      }
    } else {
      character.inventoryWeapons.push(weapon);
    }
    saveCharacter();
    renderInventaire();
    if (spellsCache) renderSpellsList();
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
      const wname = character.inventoryWeapons[i].name;
      character.inventoryWeapons.splice(i, 1);
      if (character.handSlots) {
        if (character.handSlots.left  === wname) character.handSlots.left  = '';
        if (character.handSlots.right === wname) character.handSlots.right = '';
      }
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

  // --- Equipment modal ---
  function openEquipModal(editIdx) {
    equipEditIndex = editIdx;
    const item = editIdx !== null ? character.inventoryEquipment[editIdx] : null;

    document.getElementById('equip-modal-title').textContent = item ? 'Modifier l\'équipement' : 'Ajouter un équipement';
    document.getElementById('btn-em-confirm').textContent = item ? 'Enregistrer' : 'Ajouter';
    document.getElementById('em-name').value = item ? item.name : '';
    document.getElementById('em-desc').value = item ? (item.desc || '') : '';

    const $slotSel = document.getElementById('em-slot-type');
    $slotSel.innerHTML = EQUIPMENT_SLOT_TYPES.map(s =>
      '<option value="' + s.key + '"' + (item && item.slotType === s.key ? ' selected' : '') + '>' + s.icon + ' ' + s.label + '</option>'
    ).join('');

    updateEmConditionalSections();

    if (item && item.slotType === 'chest') {
      document.getElementById('em-armor-cat').value = item.armorCat || '';
      updateEmArmorTypes(item.armorType || '');
      document.getElementById('em-armor-bonus').value = item.armorBonus || 0;
    } else {
      document.getElementById('em-armor-cat').value = '';
      document.getElementById('em-armor-type').innerHTML = '<option value="">Choisir une catégorie d\'abord…</option>';
      document.getElementById('em-armor-info').classList.add('hidden');
    }
    if (item && item.slotType === 'shield') {
      document.getElementById('em-shield-bonus').value = item.shieldBonus || 2;
    }

    renderEmStatRows(item ? (item.statBonuses || []) : []);
    renderEmSkillRows(item ? (item.skillBonuses || []) : []);
    renderEmSpellSelected(item ? (item.spells || []) : []);
    document.getElementById('em-spell-search').value = '';
    document.getElementById('em-spell-results').innerHTML = '';

    document.getElementById('equip-inv-modal').classList.remove('hidden');
    document.getElementById('em-name').focus();
  }

  function updateEmConditionalSections() {
    const slotType = document.getElementById('em-slot-type').value;
    document.getElementById('em-armor-section').classList.toggle('hidden', slotType !== 'chest');
    document.getElementById('em-shield-section').classList.toggle('hidden', slotType !== 'shield');
    if (slotType === 'chest') renderEmArmorPicker();
  }

  function renderEmArmorPicker() {
    const $picker = document.getElementById('em-armor-picker');
    if (!$picker) return;
    const source = armorCache ? armorCache.filter(a => a.category !== 'Bouclier') : Object.values(ARMOR_CATEGORIES).flat();
    $picker.innerHTML = source.map(a =>
      '<button type="button" class="em-armor-pick-btn" data-name="' + a.name + '" data-cat="' + a.category + '">' +
        a.name + '<span class="em-pick-ca">CA ' + a.baseCA + '</span>' +
      '</button>'
    ).join('');
    $picker.querySelectorAll('.em-armor-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const cat  = btn.dataset.cat;
        document.getElementById('em-name').value = name;
        document.getElementById('em-armor-cat').value = cat;
        updateEmArmorTypes(name);
        $picker.querySelectorAll('.em-armor-pick-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  function updateEmArmorTypes(selectedName) {
    const cat = document.getElementById('em-armor-cat').value;
    const $t = document.getElementById('em-armor-type');
    const armors = ARMOR_CATEGORIES[cat] || [];
    $t.innerHTML = '<option value="">Choisir…</option>' +
      armors.map(a => '<option value="' + a.name + '"' + (a.name === selectedName ? ' selected' : '') + '>' + a.name + ' (CA ' + a.baseCA + ')</option>').join('');
    updateEmArmorInfo();
  }

  function updateEmArmorInfo() {
    const cat = document.getElementById('em-armor-cat').value;
    const typeName = document.getElementById('em-armor-type').value;
    const bonus = parseInt(document.getElementById('em-armor-bonus').value, 10) || 0;
    const $info = document.getElementById('em-armor-info');
    const armor = (ARMOR_CATEGORIES[cat] || []).find(a => a.name === typeName);
    if (armor) {
      $info.classList.remove('hidden');
      const total = armor.baseCA + bonus;
      const bonusStr = bonus ? ' +' + bonus + ' → CA ' + total : '';
      document.getElementById('em-armor-ca-display').textContent = 'CA de base : ' + armor.baseCA + bonusStr;
      const dexLabel = armor.dex === 'full' ? 'Dextérité : totale' : armor.dex === 'max2' ? 'Dextérité : max +2' : 'Dextérité : aucune';
      document.getElementById('em-armor-dex-display').textContent = dexLabel;
      const stealthEl = document.getElementById('em-armor-stealth-display');
      if (stealthEl) stealthEl.textContent = armor.stealth ? '⚠️ Désavantage Discrétion' : '';
      const costEl = document.getElementById('em-armor-cost-display');
      if (costEl) costEl.textContent = armor.cost ? armor.cost + (armor.strength ? ' · FOR ' + armor.strength + ' min.' : '') : '';
    } else {
      $info.classList.add('hidden');
    }
  }

  function renderEmStatRows(rows) {
    const $c = document.getElementById('em-stat-rows');
    $c.innerHTML = '';
    rows.forEach((row, i) => {
      const div = document.createElement('div');
      div.className = 'wm-dmg-row';
      div.innerHTML =
        '<select class="em-stat-key wm-select">' +
          Object.entries(STATS).map(([k, v]) => '<option value="' + k + '"' + (k === row.stat ? ' selected' : '') + '>' + v + '</option>').join('') +
        '</select>' +
        '<input type="number" class="em-stat-amount wm-dmg-amount" placeholder="+2" value="' + (row.amount || '') + '">' +
        '<button class="btn-em-del-stat">✕</button>';
      div.querySelector('.btn-em-del-stat').addEventListener('click', () => {
        rows.splice(i, 1);
        renderEmStatRows(rows);
      });
      $c.appendChild(div);
    });
    $c._rows = rows;
  }

  function renderEmSkillRows(rows) {
    const $c = document.getElementById('em-skill-rows');
    $c.innerHTML = '';
    rows.forEach((row, i) => {
      const div = document.createElement('div');
      div.className = 'wm-dmg-row';
      div.innerHTML =
        '<select class="em-skill-key wm-select">' +
          SKILLS.map(s => '<option value="' + s.name + '"' + (s.name === row.skill ? ' selected' : '') + '>' + s.name + '</option>').join('') +
        '</select>' +
        '<input type="number" class="em-skill-bonus wm-dmg-amount" placeholder="+2" value="' + (row.bonus || '') + '">' +
        '<button class="btn-em-del-skill">✕</button>';
      div.querySelector('.btn-em-del-skill').addEventListener('click', () => {
        rows.splice(i, 1);
        renderEmSkillRows(rows);
      });
      $c.appendChild(div);
    });
    $c._rows = rows;
  }

  async function renderEmSpellResults(search) {
    const $r = document.getElementById('em-spell-results');
    $r.innerHTML = '';
    if (!search) return;
    const spells = await fetchAllSpells();
    const filtered = spells.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
    filtered.forEach(spell => {
      const item = document.createElement('div');
      item.className = 'wm-spell-result-item';
      item.textContent = spell.name + (spell.level === 0 ? ' (cantrip)' : ' (niv.' + spell.level + ')');
      item.addEventListener('click', () => {
        const $sel = document.getElementById('em-spell-selected');
        const existing = [...$sel.querySelectorAll('.wm-spell-chip')].map(c => c.dataset.id);
        if (existing.includes(spell.id)) return;
        addWmSpellChip($sel, { id: spell.id, name: spell.name, uses: 1, usesLeft: 1, recovery: 'Repos long' });
        document.getElementById('em-spell-search').value = '';
        document.getElementById('em-spell-results').innerHTML = '';
      });
      $r.appendChild(item);
    });
  }

  function renderEmSpellSelected(spells) {
    const $sel = document.getElementById('em-spell-selected');
    $sel.innerHTML = '';
    spells.forEach(sp => addWmSpellChip($sel, sp));
  }

  document.getElementById('em-slot-type').addEventListener('change', updateEmConditionalSections);
  document.getElementById('em-armor-cat').addEventListener('change', () => updateEmArmorTypes(''));
  document.getElementById('em-armor-type').addEventListener('change', updateEmArmorInfo);
  document.getElementById('em-armor-bonus').addEventListener('change', updateEmArmorInfo);
  document.getElementById('em-spell-search').addEventListener('input', (e) => renderEmSpellResults(e.target.value));

  document.getElementById('btn-em-add-stat').addEventListener('click', () => {
    const $c = document.getElementById('em-stat-rows');
    const rows = $c._rows || [];
    rows.push({ stat: 'strength', amount: '' });
    renderEmStatRows(rows);
  });

  document.getElementById('btn-em-add-skill').addEventListener('click', () => {
    const $c = document.getElementById('em-skill-rows');
    const rows = $c._rows || [];
    rows.push({ skill: SKILLS[0].name, bonus: '' });
    renderEmSkillRows(rows);
  });

  document.getElementById('btn-em-confirm').addEventListener('click', () => {
    const name = document.getElementById('em-name').value.trim();
    if (!name) { document.getElementById('em-name').focus(); return; }

    const slotType = document.getElementById('em-slot-type').value;
    const desc = document.getElementById('em-desc').value.trim();

    let armorCat = '', armorType = '', baseCA = 0, dex = '', armorBonus = 0;
    if (slotType === 'chest') {
      armorCat   = document.getElementById('em-armor-cat').value;
      armorType  = document.getElementById('em-armor-type').value;
      armorBonus = parseInt(document.getElementById('em-armor-bonus').value, 10) || 0;
      const armor = (ARMOR_CATEGORIES[armorCat] || []).find(a => a.name === armorType);
      if (armor) { baseCA = armor.baseCA; dex = armor.dex; }
    }

    let shieldBonus = 0;
    if (slotType === 'shield') {
      shieldBonus = parseInt(document.getElementById('em-shield-bonus').value, 10) || 2;
    }

    const $statRows = document.getElementById('em-stat-rows');
    const statBonuses = [...$statRows.querySelectorAll('.wm-dmg-row')].map(row => ({
      stat:   row.querySelector('.em-stat-key').value,
      amount: parseInt(row.querySelector('.em-stat-amount').value, 10) || 0,
    })).filter(b => b.amount);

    const $skillRows = document.getElementById('em-skill-rows');
    const skillBonuses = [...$skillRows.querySelectorAll('.wm-dmg-row')].map(row => ({
      skill: row.querySelector('.em-skill-key').value,
      bonus: parseInt(row.querySelector('.em-skill-bonus').value, 10) || 0,
    })).filter(b => b.bonus);

    const spells = [...document.getElementById('em-spell-selected').querySelectorAll('.wm-spell-chip')].map(chip => ({
      id:       chip.dataset.id,
      name:     chip.querySelector('.wm-chip-name').textContent,
      uses:     parseInt(chip.querySelector('.wm-chip-uses').value, 10) || 1,
      usesLeft: parseInt(chip.querySelector('.wm-chip-uses').value, 10) || 1,
      recovery: chip.querySelector('.wm-chip-recovery').value,
    }));

    const equipped = equipEditIndex !== null ? (character.inventoryEquipment[equipEditIndex].equipped || false) : false;
    const newItem = { name, slotType, armorCat, armorType, baseCA, armorBonus, dex, shieldBonus, statBonuses, skillBonuses, spells, desc, equipped };

    if (!character.inventoryEquipment) character.inventoryEquipment = [];
    if (equipEditIndex !== null) {
      const oldName = character.inventoryEquipment[equipEditIndex].name;
      newItem.spells = spells.map((s, si) => ({ ...s, usesLeft: character.inventoryEquipment[equipEditIndex].spells?.[si]?.usesLeft ?? s.uses }));
      character.inventoryEquipment[equipEditIndex] = newItem;
      if (oldName !== name) {
        if (newItem.slotType === 'shield') {
          if (character.handSlots) {
            if (character.handSlots.left  === oldName) character.handSlots.left  = name;
            if (character.handSlots.right === oldName) character.handSlots.right = name;
          }
        } else if (character.equipmentSlots) {
          Object.keys(character.equipmentSlots).forEach(k => {
            if (character.equipmentSlots[k] === oldName) character.equipmentSlots[k] = name;
          });
        }
      }
    } else {
      character.inventoryEquipment.push(newItem);
    }
    saveCharacter();
    renderInventaire();
    if (spellsCache) renderSpellsList();
    document.getElementById('equip-inv-modal').classList.add('hidden');
  });

  document.getElementById('btn-em-cancel').addEventListener('click', () => {
    document.getElementById('equip-inv-modal').classList.add('hidden');
  });

  function openEquipDetail(i) {
    const item = character.inventoryEquipment[i];
    const slotDef = EQUIPMENT_SLOT_TYPES.find(s => s.key === item.slotType) || { icon: '🎒', label: '—' };

    document.getElementById('ed-name').textContent = item.name;

    let meta = '<span class="weapon-inv-type">' + slotDef.icon + ' ' + slotDef.label + '</span>';
    if (item.slotType === 'chest' && item.armorType) {
      const totalCA = item.baseCA + (item.armorBonus || 0);
      const bonusStr = item.armorBonus ? ' +' + item.armorBonus : '';
      meta += ' <span class="weapon-inv-type">' + item.armorType + bonusStr + ' (CA ' + totalCA + ')</span>';
    }
    if (item.slotType === 'shield' && item.shieldBonus) {
      meta += ' <span class="weapon-inv-bonus">+' + item.shieldBonus + ' CA</span>';
    }
    document.getElementById('ed-meta').innerHTML = meta;

    let bonusHtml = '';
    if (item.statBonuses && item.statBonuses.length) {
      bonusHtml += '<div class="wd-section-title">Bonus de caractéristiques</div>' +
        item.statBonuses.map(b => '<span class="wd-dmg-tag">+' + b.amount + ' ' + (STATS[b.stat] || b.stat) + '</span>').join('');
    }
    if (item.skillBonuses && item.skillBonuses.length) {
      bonusHtml += '<div class="wd-section-title">Bonus de compétences</div>' +
        item.skillBonuses.map(b => '<span class="wd-dmg-tag">+' + b.bonus + ' ' + b.skill + '</span>').join('');
    }
    document.getElementById('ed-bonuses').innerHTML = bonusHtml;

    let spellsHtml = '';
    if (item.spells && item.spells.length) {
      spellsHtml = '<div class="wd-section-title">Sorts associés</div>' +
        item.spells.map((s, si) =>
          '<div class="wd-spell-row">' +
            '<span class="wd-spell-name">✨ ' + s.name + '</span>' +
            '<div class="wd-spell-uses">' +
              '<button class="btn-ed-spell-use" data-ei="' + i + '" data-si="' + si + '" data-d="-1">−</button>' +
              '<span class="wd-uses-left">' + (s.usesLeft ?? s.uses) + ' / ' + s.uses + '</span>' +
              '<button class="btn-ed-spell-use" data-ei="' + i + '" data-si="' + si + '" data-d="1">+</button>' +
              '<span class="wd-recovery">(' + s.recovery + ')</span>' +
            '</div>' +
          '</div>'
        ).join('');
    }
    document.getElementById('ed-spells').innerHTML = spellsHtml;
    document.getElementById('ed-spells').querySelectorAll('.btn-ed-spell-use').forEach(btn => {
      btn.addEventListener('click', () => {
        const ei = parseInt(btn.dataset.ei, 10);
        const si = parseInt(btn.dataset.si, 10);
        const sp = character.inventoryEquipment[ei].spells[si];
        sp.usesLeft = Math.max(0, Math.min(sp.uses, (sp.usesLeft ?? sp.uses) + parseInt(btn.dataset.d, 10)));
        saveCharacter();
        openEquipDetail(ei);
      });
    });

    document.getElementById('ed-desc').textContent = item.desc || '';
    document.getElementById('btn-ed-edit').onclick = () => {
      document.getElementById('equip-inv-detail-modal').classList.add('hidden');
      openEquipModal(i);
    };
    document.getElementById('btn-ed-delete').onclick = () => {
      const edItem = character.inventoryEquipment[i];
      character.inventoryEquipment.splice(i, 1);
      if (edItem.slotType === 'shield') {
        if (character.handSlots) {
          if (character.handSlots.left  === edItem.name) character.handSlots.left  = '';
          if (character.handSlots.right === edItem.name) character.handSlots.right = '';
        }
      } else if (character.equipmentSlots) {
        Object.keys(character.equipmentSlots).forEach(k => {
          if (character.equipmentSlots[k] === edItem.name) character.equipmentSlots[k] = '';
        });
      }
      saveCharacter();
      renderInventaire();
      document.getElementById('equip-inv-detail-modal').classList.add('hidden');
    };
    document.getElementById('equip-inv-detail-modal').classList.remove('hidden');
  }

  // --- Équipement rapide depuis l'inventaire ---

  function getSlotsForType(slotType) {
    if (slotType === 'wrist')  return ['wristRight', 'wristLeft'];
    if (slotType === 'finger') return ['fingerRight', 'fingerLeft'];
    return [slotType];
  }

  function slotLabel(s) {
    if (s === 'right') return 'Main D';
    if (s === 'left')  return 'Main G';
    const all = [
      ...EQUIP_SLOTS_LEFT,
      ...EQUIP_SLOTS_RIGHT.flatMap(sl => sl.pairKey
        ? [{ key: sl.key, label: sl.label }, { key: sl.pairKey, label: sl.pairLabel }]
        : [sl]
      )
    ];
    const found = all.find(sl => sl.key === s);
    return found ? found.label : s;
  }

  function itemSummaryHtml(name, itemType) {
    if (!name) return '';
    const parts = [];
    if (itemType === 'weapon') {
      const w = (character.inventoryWeapons || []).find(x => x.name === name);
      if (!w) return '';
      const wt = WEAPON_TYPES.find(t => t.name === w.type) || {};
      if (wt.baseDmg) parts.push(wt.baseDmg);
      (w.damageBonus || []).forEach(d => { if (d.type && d.amount) parts.push(d.amount + ' ' + d.type); });
      if (w.atkBonus) parts.push('Atk ' + w.atkBonus);
      if (w.hands === 2)   parts.push('2 mains');
      if (w.hands === 'V') parts.push('Polyvalente');
    } else {
      const item = (character.inventoryEquipment || []).find(x => x.name === name);
      if (!item) return '';
      if (item.slotType === 'chest' && item.baseCA)    parts.push('CA ' + (item.baseCA + (item.armorBonus || 0)));
      if (item.slotType === 'shield' && item.shieldBonus) parts.push('+' + item.shieldBonus + ' CA');
      (item.statBonuses  || []).forEach(b => { if (b.stat  && b.amount) parts.push('+' + b.amount + ' ' + (STATS[b.stat] || b.stat)); });
      (item.skillBonuses || []).forEach(b => { if (b.skill && b.bonus)  parts.push('+' + b.bonus  + ' ' + b.skill); });
    }
    return parts.length ? '<span class="conflict-item-bonus">' + parts.join(' · ') + '</span>' : '';
  }

  function conflictItemCard(name, itemType) {
    return '<div class="conflict-item-card">' +
      '<span class="conflict-item-name">' + (name || '—') + '</span>' +
      itemSummaryHtml(name, itemType) +
    '</div>';
  }

  function openEquipConflict(config) {
    const modal = document.getElementById('equip-conflict-modal');
    const content = document.getElementById('conflict-content');
    content.innerHTML = '';

    const incomingCard = conflictItemCard(config.incoming, config.itemType);

    if (config.type === 'single') {
      content.innerHTML =
        '<p class="conflict-desc">L\'emplacement <strong>' + slotLabel(config.slot) + '</strong> est déjà occupé.</p>' +
        '<div class="conflict-row-label">Équiper</div>' +
        incomingCard +
        '<div class="conflict-row-label conflict-row-label-replace">Remplacera</div>' +
        conflictItemCard(config.currentItems[0].name, config.itemType);
      const btn = document.createElement('button');
      btn.className = 'btn-primary btn-conflict-confirm';
      btn.textContent = 'Remplacer';
      btn.onclick = () => { config.onReplace(config.slot); modal.classList.add('hidden'); };
      content.appendChild(btn);
    } else if (config.type === 'paired' || config.type === 'paired-hand') {
      content.innerHTML =
        '<div class="conflict-row-label">Équiper</div>' +
        incomingCard +
        '<p class="conflict-desc conflict-desc-choose">Choisir l\'emplacement à remplacer :</p>';
      config.currentItems.forEach(ci => {
        const row = document.createElement('div');
        row.className = 'conflict-choice-row';
        row.innerHTML =
          '<div class="conflict-choice-left">' +
            '<span class="conflict-slot-label">' + slotLabel(ci.slot) + '</span>' +
            conflictItemCard(ci.name, config.itemType) +
          '</div>';
        const btn = document.createElement('button');
        btn.className = 'btn-primary btn-conflict-pick';
        btn.textContent = 'Remplacer';
        btn.onclick = () => { config.onReplace(ci.slot); modal.classList.add('hidden'); };
        row.appendChild(btn);
        content.appendChild(row);
      });
    } else if (config.type === '2h') {
      const occupied = config.currentItems.filter(ci => ci.name);
      content.innerHTML =
        '<div class="conflict-row-label">Équiper (2 mains)</div>' +
        incomingCard +
        '<p class="conflict-desc conflict-desc-choose">Remplacera :</p>' +
        occupied.map(ci =>
          '<div class="conflict-2h-item">' +
            '<span class="conflict-slot-label">' + slotLabel(ci.slot) + '</span>' +
            conflictItemCard(ci.name, config.itemType) +
          '</div>'
        ).join('');
      const btn = document.createElement('button');
      btn.className = 'btn-primary btn-conflict-confirm';
      btn.textContent = 'Confirmer';
      btn.onclick = () => { config.onReplace(); modal.classList.add('hidden'); };
      content.appendChild(btn);
    }

    document.getElementById('btn-conflict-cancel').onclick = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');
  }

  function quickEquipEquipItem(item) {
    // Le bouclier s'équipe dans un emplacement de main (comme une arme 1M)
    if (item.slotType === 'shield') {
      if (!character.handSlots) character.handSlots = { left: '', right: '' };
      const inRight = character.handSlots.right === item.name;
      const inLeft  = character.handSlots.left  === item.name;
      if (inRight || inLeft) {
        if (inRight) character.handSlots.right = '';
        if (inLeft)  character.handSlots.left  = '';
        saveCharacter(); renderInventaire();
        return;
      }
      const curR = character.handSlots.right;
      const curL = character.handSlots.left;
      if (!curR) {
        character.handSlots.right = item.name;
        saveCharacter(); renderInventaire();
      } else if (!curL) {
        character.handSlots.left = item.name;
        saveCharacter(); renderInventaire();
      } else {
        openEquipConflict({
          type: 'paired-hand', incoming: item.name, itemType: 'equipment',
          currentItems: [{ slot: 'right', name: curR }, { slot: 'left', name: curL }],
          onReplace: s => { character.handSlots[s] = item.name; saveCharacter(); renderInventaire(); }
        });
      }
      return;
    }

    if (!character.equipmentSlots) character.equipmentSlots = {};
    const slots = getSlotsForType(item.slotType);

    const occupied = slots.find(s => character.equipmentSlots[s] === item.name);
    if (occupied) {
      character.equipmentSlots[occupied] = '';
      saveCharacter(); renderInventaire();
      return;
    }

    if (slots.length === 1) {
      const slot = slots[0];
      const cur = character.equipmentSlots[slot];
      if (!cur) {
        character.equipmentSlots[slot] = item.name;
        saveCharacter(); renderInventaire();
      } else {
        openEquipConflict({
          type: 'single', slot, incoming: item.name, itemType: 'equipment',
          currentItems: [{ slot, name: cur }],
          onReplace: s => { character.equipmentSlots[s] = item.name; saveCharacter(); renderInventaire(); }
        });
      }
    } else {
      const [slotA, slotB] = slots;
      const curA = character.equipmentSlots[slotA];
      const curB = character.equipmentSlots[slotB];
      if (!curA) {
        character.equipmentSlots[slotA] = item.name;
        saveCharacter(); renderInventaire();
      } else if (!curB) {
        character.equipmentSlots[slotB] = item.name;
        saveCharacter(); renderInventaire();
      } else {
        openEquipConflict({
          type: 'paired', incoming: item.name, itemType: 'equipment',
          currentItems: [{ slot: slotA, name: curA }, { slot: slotB, name: curB }],
          onReplace: s => { character.equipmentSlots[s] = item.name; saveCharacter(); renderInventaire(); }
        });
      }
    }
  }

  function quickEquipWeapon(w) {
    if (!character.handSlots) character.handSlots = { left: '', right: '' };

    const inRight = character.handSlots.right === w.name;
    const inLeft  = character.handSlots.left  === w.name;
    if (inRight || inLeft) {
      if (inRight) character.handSlots.right = '';
      if (inLeft)  character.handSlots.left  = '';
      saveCharacter(); renderInventaire();
      return;
    }

    if (w.hands === 2) {
      const curR = character.handSlots.right;
      const curL = character.handSlots.left;
      if (!curR && !curL) {
        character.handSlots.right = w.name;
        character.handSlots.left  = w.name;
        saveCharacter(); renderInventaire();
      } else {
        openEquipConflict({
          type: '2h', incoming: w.name, itemType: 'weapon',
          currentItems: [{ slot: 'right', name: curR }, { slot: 'left', name: curL }],
          onReplace: () => {
            character.handSlots.right = w.name;
            character.handSlots.left  = w.name;
            saveCharacter(); renderInventaire();
          }
        });
      }
      return;
    }

    const curR = character.handSlots.right;
    const curL = character.handSlots.left;
    if (!curR) {
      character.handSlots.right = w.name;
      saveCharacter(); renderInventaire();
    } else if (!curL) {
      character.handSlots.left = w.name;
      saveCharacter(); renderInventaire();
    } else {
      openEquipConflict({
        type: 'paired-hand', incoming: w.name, itemType: 'weapon',
        currentItems: [{ slot: 'right', name: curR }, { slot: 'left', name: curL }],
        onReplace: s => { character.handSlots[s] = w.name; saveCharacter(); renderInventaire(); }
      });
    }
  }

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
