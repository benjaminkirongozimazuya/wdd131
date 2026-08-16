// ==========================================
// 1. GESTION DE LA MUSIQUE DE FOND
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle-btn');

if (bgMusic) {
  bgMusic.volume = 0.2;
}

function toggleBackgroundMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      if (musicBtn) musicBtn.innerHTML = '🔊 Musique : ON';
    }).catch(err => console.log("Erreur lecture audio:", err));
  } else {
    bgMusic.pause();
    if (musicBtn) musicBtn.innerHTML = '🔇 Musique : OFF';
  }
}

document.addEventListener('click', function initMusicOnInteraction() {
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().then(() => {
      if (musicBtn) musicBtn.innerHTML = '🔊 Musique : ON';
    }).catch(() => {});
  }
  document.removeEventListener('click', initMusicOnInteraction);
}, { once: true });


// ==========================================
// 2. EFFETS SONORES (Web Audio API native)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

function playVictorySound() {
  initAudio();
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime + index * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.12 + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + index * 0.12);
    osc.stop(audioCtx.currentTime + index * 0.12 + 0.3);
  });
}

function playDefeatSound() {
  initAudio();
  const notes = [300, 260, 220, 180];
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime + index * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.15 + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + index * 0.15);
    osc.stop(audioCtx.currentTime + index * 0.15 + 0.25);
  });
}


// ==========================================
// 3. VARIABLES D'ÉTAT DU JEU
// ==========================================
let currentMode = null;       // 'level' ou 'category'
let currentIdentifier = null; // Numéro du niveau (1-10) ou nom de la catégorie ('histoire', etc.)
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let coins = 0;
let timer;
let timeLeft = 15;


// ==========================================
// 4. BANQUE DE DONNÉES - NIVEAUX (1 À 10)
// ==========================================
const levelsData = {
  1: [
    { question: "Maths : Combien font 7 x 8 ?", options: ["54", "56", "64", "49"], answer: "56" },
    { question: "Géométrie : Combien de côtés possède un hexagone ?", options: ["5", "6", "7", "8"], answer: "6" },
    { question: "Psycho-technique : Complétez la suite : 2, 4, 6, 8, ...", options: ["9", "10", "11", "12"], answer: "10" },
    { question: "Physique : Quel est l'état de l'eau pure à 100°C sous pression normale ?", options: ["Solide", "Liquide", "Gazeux", "Plasma"], answer: "Gazeux" }
  ],
  2: [
    { question: "Maths : Si x + 5 = 12, que vaut x ?", options: ["5", "6", "7", "8"], answer: "7" },
    { question: "Physique : Quelle est l'unité de mesure de la force dans le SI ?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: "Newton" },
    { question: "Géométrie : Quelle est la somme des angles internes d'un triangle ?", options: ["90°", "180°", "360°", "270°"], answer: "180°" },
    { question: "Psycho-technique : Quel est l'intrus parmi ces formes ?", options: ["Carré", "Triangle", "Sphère", "Rectangle"], answer: "Sphère" }
  ],
  3: [
    { question: "Maths : Calculez : 15% de 200.", options: ["20", "25", "30", "35"], answer: "30" },
    { question: "Géométrie : Quel est le périmètre d'un carré de côté 6 cm ?", options: ["12 cm", "24 cm", "36 cm", "18 cm"], answer: "24 cm" },
    { question: "Physique : Quelle force attire les objets vers le centre de la Terre ?", options: ["La réfraction", "La gravité", "La magnétostriction", "La tension"], answer: "La gravité" },
    { question: "Psycho-technique : Complétez : A1, B2, C3, D4, ...", options: ["E5", "E6", "F5", "D5"], answer: "E5" }
  ],
  4: [
    { question: "Maths : Résolvez l'équation : 2x - 4 = 10", options: ["x = 5", "x = 6", "x = 7", "x = 8"], answer: "x = 7" },
    { question: "Géométrie : Aire d'un rectangle de longueur 8 cm et largeur 5 cm ?", options: ["40 cm²", "26 cm²", "13 cm²", "30 cm²"], answer: "40 cm²" },
    { question: "Physique : Quelle est la formule de la vitesse moyenne ?", options: ["V = D x T", "V = D / T", "V = T / D", "V = D + T"], answer: "V = D / T" },
    { question: "Psycho-technique : Si 3 chats attrapent 3 souris en 3 min, combien de temps pour 100 chats et 100 souris ?", options: ["100 min", "3 min", "30 min", "1 min"], answer: "3 min" }
  ],
  5: [
    { question: "Maths : Que vaut 5 au carré (5²) multiplié par 2 ?", options: ["20", "25", "50", "100"], answer: "50" },
    { question: "Géométrie : Quel théorème s'applique aux triangles rectangles ?", options: ["Thalès", "Pythagore", "Loi des sinus", "Al-Kashi"], answer: "Pythagore" },
    { question: "Physique : Quelle est la première loi de Newton ?", options: ["Gravitation", "Principe d'inertie", "Action-Réaction", "Loi d'Ohm"], answer: "Principe d'inertie" },
    { question: "Psycho-technique : Suite logique : 1, 1, 2, 3, 5, 8, ...", options: ["11", "12", "13", "15"], answer: "13" }
  ],
  6: [
    { question: "Maths : Simplifiez la fraction : 24 / 36", options: ["1/2", "2/3", "3/4", "4/5"], answer: "2/3" },
    { question: "Géométrie : Combien de côtés parallèles possède un trapèze ?", options: ["Aucun", "1 paire", "2 paires", "3 paires"], answer: "1 paire" },
    { question: "Physique : Quelle est l'unité de mesure de la résistance électrique ?", options: ["Volt", "Ampère", "Ohm", "Watt"], answer: "Ohm" },
    { question: "Psycho-technique : Anagramme : Quel mot réorganisé forme le mot 'CHIEN' ?", options: ["NICHE", "CHINE", "CHINE/NICHE", "AUCUN"], answer: "CHINE/NICHE" }
  ],
  7: [
    { question: "Maths : Quelle est la racine carrée de 144 ?", options: ["10", "11", "12", "14"], answer: "12" },
    { question: "Géométrie : Formule du volume d'un cube de côté 'a' ?", options: ["a²", "6a", "a³", "4a³"], answer: "a³" },
    { question: "Physique : Valeur approximative de la pesanteur terrestre (g) ?", options: ["8.5 m/s²", "9.81 m/s²", "10.5 m/s²", "12.0 m/s²"], answer: "9.81 m/s²" },
    { question: "Psycho-technique : Complétez : 3, 9, 27, 81, ...", options: ["162", "243", "324", "100"], answer: "243" }
  ],
  8: [
    { question: "Maths : Développez l'expression : (x + 3)²", options: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9", "2x + 6"], answer: "x² + 6x + 9" },
    { question: "Géométrie : Valeur approximative de Pi (π) ?", options: ["3.12", "3.14", "3.16", "3.18"], answer: "3.14" },
    { question: "Physique : Quelle relation exprime la loi d'Ohm ?", options: ["U = R / I", "U = R x I", "P = U x I", "I = U x R"], answer: "U = R x I" },
    { question: "Psycho-technique : Si aujourd'hui est mardi, quel jour serons-nous dans 100 jours ?", options: ["Jeudi", "Vendredi", "Samedi", "Dimanche"], answer: "Jeudi" }
  ],
  9: [
    { question: "Maths : Résolvez : x + y = 10 et x - y = 2", options: ["x=6, y=4", "x=5, y=5", "x=7, y=3", "x=8, y=2"], answer: "x=6, y=4" },
    { question: "Géométrie : Somme des angles d'un quadrilatère ?", options: ["180°", "270°", "360°", "540°"], answer: "360°" },
    { question: "Physique : Relation d'équivalence masse-énergie d'Einstein ?", options: ["E = mc", "E = m/c²", "E = mc²", "E = 1/2 mv²"], answer: "E = mc²" },
    { question: "Psycho-technique : Suite : 100, 95, 85, 70, 50, ...", options: ["25", "30", "35", "20"], answer: "25" }
  ],
  10: [
    { question: "Maths : Dérivée de la fonction f(x) = x³ ?", options: ["3x", "3x²", "x²", "x³/3"], answer: "3x²" },
    { question: "Géométrie : Polyèdre régulier à 12 faces ?", options: ["Icosaèdre", "Dodécaèdre", "Octaèdre", "Tétraèdre"], answer: "Dodécaèdre" },
    { question: "Physique : Principe imposant l'incertitude position/vitesse ?", options: ["Pauli", "Heisenberg", "Effet Photoélectrique", "Kepler"], answer: "Heisenberg" },
    { question: "Psycho-technique : Nombres premiers : 2, 3, 5, 7, 11, 13, 17, ...", options: ["18", "19", "21", "23"], answer: "19" }
  ]
};


// ==========================================
// 5. BANQUE DE DONNÉES - CATÉGORIES (INTÉGRALE)
// ==========================================
const questionsData = {
  histoire: [
    { question: "En quelle année est intervenue l'indépendance de la RDC ?", options: ["1960", "1958", "1965", "1970"], answer: "1960" },
    { question: "Qui fut le premier Président de la RDC ?", options: ["Joseph Kasa-Vubu", "Patrice Lumumba", "Mobutu Sese Seko", "L.D. Kabila"], answer: "Joseph Kasa-Vubu" },
    { question: "En quelle année s'est terminée la Seconde Guerre mondiale ?", options: ["1918", "1939", "1945", "1950"], answer: "1945" },
    { question: "Qui était le premier empereur de Rome ?", options: ["Jules César", "Auguste", "Néron", "Marc Aurèle"], answer: "Auguste" },
    { question: "Quel grand empire antique a construit les pyramides de Gizeh ?", options: ["Empire Romain", "Empire Grec", "Égypte antique", "Empire Babylonien"], answer: "Égypte antique" },
    { question: "Quelle révolution a débuté en 1789 ?", options: ["Révolution Russe", "Révolution Française", "Révolution Américaine", "Révolution Industrielle"], answer: "Révolution Française" },
    { question: "Quel explorateur a découvert l'Amérique en 1492 ?", options: ["Vasco de Gama", "Christophe Colomb", "Magellan", "Amerigo Vespucci"], answer: "Christophe Colomb" },
    { question: "Quelle muraille historique a été construite pour protéger la Chine des invasions ?", options: ["Muraille de Hadrien", "Grande Muraille de Chine", "Mur de Berlin", "Mur de Babylone"], answer: "Grande Muraille de Chine" },
    { question: "Dans quel pays se trouvait l'ancienne cité de Carthage ?", options: ["Grèce", "Italie", "Tunisie", "Égypte"], answer: "Tunisie" },
    { question: "Quel leader sud-africain a lutté contre l'Apartheid et devint président en 1994 ?", options: ["Nelson Mandela", "Desmond Tutu", "Thabo Mbeki", "Jacob Zuma"], answer: "Nelson Mandela" },
    { question: "Quelle organisation internationale a été fondée en 1945 après la Seconde Guerre mondiale ?", options: ["La Société des Nations", "L'ONU", "L'OTAN", "L'UNESCO"], answer: "L'ONU" },
    { question: "Qui a peint la fresque du plafond de la Chapelle Sixtine ?", options: ["Léonard de Vinci", "Raphaël", "Michel-Ange", "Caravage"], answer: "Michel-Ange" },
    { question: "Quel pays a colonisé la RDC sous le nom d'État indépendant du Congo ?", options: ["La France", "La Belgique", "Le Royaume-Uni", "L'Allemagne"], answer: "La Belgique" },
    { question: "En quelle année a eu lieu la chute du mur de Berlin ?", options: ["1987", "1989", "1991", "1993"], answer: "1989" },
    { question: "Quel célèbre roi mérovingien s'est converti au christianisme ?", options: ["Clovis", "Charlemagne", "Pépin le Bref", "Dagobert"], answer: "Clovis" },
    { question: "Quel traité a mis fin à la Première Guerre mondiale en 1919 ?", options: ["Traité de Versailles", "Traité de Paris", "Traité de Vienne", "Traité de Tordesillas"], answer: "Traité de Versailles" },
    { question: "Quel scientifique et philosophe grec a été condamné à boire la ciguë ?", options: ["Platon", "Aristote", "Socrate", "Pythagore"], answer: "Socrate" },
    { question: "Quelle civilisation méso-américaine est connue pour son calendrier précis s'arrêtant en 2012 ?", options: ["Les Incas", "Les Aztèques", "Les Mayas", "Les Olmèques"], answer: "Les Mayas" },
    { question: "Qui fut le premier homme dans l'espace en 1961 ?", options: ["Neil Armstrong", "Youri Gagarine", "Buzz Aldrin", "John Glenn"], answer: "Youri Gagarine" },
    { question: "Quel pharaon égyptien a vu sa tombe découverte intacte en 1922 par Howard Carter ?", options: ["Ramsès II", "Toutânkhamon", "Akhenaton", "Khéops"], answer: "Toutânkhamon" },
    { question: "De quelle ville Jeanne d'Arc a-t-elle libéré les habitants en 1429 ?", options: ["Paris", "Orléans", "Rouen", "Reims"], answer: "Orléans" },
    { question: "Quel empire était dirigé par les tsars avant 1917 ?", options: ["L'Empire Ottoman", "L'Empire Austro-Hongrois", "L'Empire Russe", "L'Empire Byzantin"], answer: "L'Empire Russe" },
    { question: "Quel pays a offert la Statue de la Liberté aux États-Unis ?", options: ["Le Royaume-Uni", "La France", "L'Espagne", "L'Italie"], answer: "La France" },
    { question: "Quel événement marque le début de la Seconde Guerre mondiale en Europe (1939) ?", options: ["Attaque de Pearl Harbor", "Invasion de la Pologne", "Signature du pacte germano-soviétique", "Assassinat de François-Ferdinand"], answer: "Invasion de la Pologne" },
    { question: "Quel grand empire africain était dirigé par Soundiata Keïta au XIIIe siècle ?", options: ["Empire du Ghana", "Empire du Mali", "Empire Songhaï", "Royaume du Congo"], answer: "Empire du Mali" },
    { question: "Quel empereur romain a officialisé la liberté du culte chrétien par l'édit de Milan en 313 ?", options: ["Néron", "Constantin", "Dioclétien", "Auguste"], answer: "Constantin" },
    { question: "Quel pays a connu la révolution des Œillets en 1974 ?", options: ["L'Espagne", "Le Portugal", "La Grèce", "L'Italie"], answer: "Le Portugal" },
    { question: "Qui fut le principal rédacteur de la Déclaration d'indépendance des États-Unis (1776) ?", options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "Abraham Lincoln"], answer: "Thomas Jefferson" },
    { question: "Quel grand explorateur portugais a atteint les Indes en contournant l'Afrique (1498) ?", options: ["Vasco de Gama", "Bartolomeu Dias", "Fernand de Magellan", "Henri le Navigateur"], answer: "Vasco de Gama" },
    { question: "Quel peuple scandinave a mené des raids en Europe du VIIIe au XIe siècle ?", options: ["Les Vandales", "Les Vikings", "Les Huns", "Les Wisigoths"], answer: "Les Vikings" },
    { question: "Quelle reine d'Égypte a séduit Jules César et Marc Antoine ?", options: ["Néfertiti", "Cléopâtre VII", "Hatchepsout", "Ankhsenamon"], answer: "Cléopâtre VII" },
    { question: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?", options: ["1967", "1969", "1971", "1973"], answer: "1969" },
    { question: "Quel explorateur a réalisé le premier tour du monde maritime (1519-1522) ?", options: ["Christophe Colomb", "Fernand de Magellan", "Jacques Cartier", "Amerigo Vespucci"], answer: "Fernand de Magellan" },
    { question: "Quelle ville fut détruite par l'éruption du Vésuve en l'an 79 ?", options: ["Rome", "Pompéi", "Athènes", "Cyrène"], answer: "Pompéi" },
    { question: "Quel dirigeant soviétique a lancé la perestroïka et la glasnost dans les années 1980 ?", options: ["Joseph Staline", "Nikita Khrouchtchev", "Mikhail Gorbatchev", "Vladimir Poutine"], answer: "Mikhail Gorbatchev" }
  ],
  sciences: [
    { question: "Quel est le symbole chimique de l'eau ?", options: ["CO2", "H2O", "O2", "NaCl"], answer: "H2O" },
    { question: "Quelle planète est surnommée la 'Planète Rouge' ?", options: ["Jupiter", "Mars", "Vénus", "Saturne"], answer: "Mars" },
    { question: "Quel est l'organe principal du système circulatoire humain ?", options: ["Le poumon", "Le cerveau", "Le cœur", "Le foie"], answer: "Le cœur" },
    { question: "Quelle est la vitesse de la lumière dans le vide ?", options: ["300 000 km/s", "150 000 km/s", "1 000 000 km/s", "30 000 km/s"], answer: "300 000 km/s" },
    { question: "Quel gaz absorbe la majeure partie des UV solaires dans la stratosphère ?", options: ["Oxygène", "Ozone", "Azote", "Hydrogène"], answer: "Ozone" },
    { question: "Quel est l'élément chimique le plus abondant dans l'univers ?", options: ["Oxygène", "Carbone", "Hydrogène", "Hélium"], answer: "Hydrogène" },
    { question: "Comment appelle-t-on le passage de l'état solide à l'état gazeux sans passer par le liquide ?", options: ["La fusion", "La vaporisation", "La sublimation", "La condensation"], answer: "La sublimation" },
    { question: "Quel scientifique a formulé la théorie de la relativité restreinte ?", options: ["Isaac Newton", "Albert Einstein", "Galilée", "Nikola Tesla"], answer: "Albert Einstein" },
    { question: "Quel est le plus grand os du corps humain ?", options: ["L'humérus", "Le tibia", "Le fémur", "Le péroné"], answer: "Le fémur" },
    { question: "Quel instrument mesure la pression atmosphérique ?", options: ["Thermomètre", "Baromètre", "Hygromètre", "Anémomètre"], answer: "Baromètre" },
    { question: "Quelle est la formule chimique du dioxyde de carbone ?", options: ["CO", "CO2", "C2O", "O2C"], answer: "CO2" },
    { question: "Quel type de cellule sanguine transporte l'oxygène dans le corps ?", options: ["Globules blancs", "Plaquettes", "Globules rouges", "Neurones"], answer: "Globules rouges" },
    { question: "Quel est l'acide présent dans l'estomac humain pour aider à la digestion ?", options: ["Acide sulfurique", "Acide chlorhydrique", "Acide nitrique", "Acide acétique"], answer: "Acide chlorhydrique" },
    { question: "Quelle est la principale source d'énergie pour la photosynthèse ?", options: ["L'eau", "Le vent", "Le Soleil", "Le sol"], answer: "Le Soleil" },
    { question: "Quel est le nombre d'électrons dans un atome neutre d'hydrogène ?", options: ["0", "1", "2", "3"], answer: "1" },
    { question: "Quelle science étudie les fossiles et la vie préhistorique ?", options: ["La géologie", "La paléontologie", "L'archéologie", "L'anthropologie"], answer: "La paléontologie" },
    { question: "Quel est le métal liquide à température ambiante ?", options: ["L'or", "Le fer", "Le mercure", "L'aluminium"], answer: "Le mercure" },
    { question: "Quel est le plus grand organe du corps humain ?", options: ["Le foie", "Le cerveau", "La peau", "Les poumons"], answer: "La peau" },
    { question: "Quel est le symbole chimique du fer ?", options: ["Fe", "F", "Fr", "Fi"], answer: "Fe" },
    { question: "Quelle est la force qui s'oppose au mouvement de deux surfaces en contact ?", options: ["La gravité", "Le frottement", "La poussée d'Archimède", "Le magnétisme"], answer: "Le frottement" },
    { question: "Quelle planète possède les anneaux les plus spectaculaires du système solaire ?", options: ["Jupiter", "Saturne", "Uranus", "Neptune"], answer: "Saturne" },
    { question: "Quel est l'élément chimique représenté par le symbole 'Au' ?", options: ["Argent", "Or", "Argon", "Azote"], answer: "Or" },
    { question: "Quelle est l'unité de mesure de la fréquence en physique ?", options: ["Le Bel", "Le Hertz", "Le Tesla", "Le Weber"], answer: "Le Hertz" },
    { question: "Quelle vitamine est synthétisée par le corps humain grâce à l'exposition au soleil ?", options: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine K"], answer: "Vitamine D" },
    { question: "Quel est le nom de notre galaxie ?", options: ["Andromède", "La Voie lactée", "Le Grand Nuage de Magellan", "Sombrero"], answer: "La Voie lactée" },
    { question: "Quel gaz est indispensable à la respiration humaine ?", options: ["Azote", "Dioxygène", "Dioxyde de carbone", "Hélium"], answer: "Dioxygène" },
    { question: "Comment appelle-t-on les animaux qui mangent à la fois des plantes et de la viande ?", options: ["Herbivores", "Carnivores", "Omnivores", "Insectivores"], answer: "Omnivores" },
    { question: "Quelle est la température du zéro absolu en degrés Celsius ?", options: ["-273.15 °C", "0 °C", "-100 °C", "-500 °C"], answer: "-273.15 °C" },
    { question: "Quel scientifique a découvert la pénicilline ?", options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Robert Koch"], answer: "Alexander Fleming" },
    { question: "Quelle est la plus petite unité structurelle et fonctionnelle du vivant ?", options: ["L'organe", "Le tissu", "La cellule", "La molécule"], answer: "La cellule" },
    { question: "Quel est l'isotope radioactif utilisé pour dater les objets archéologiques organiques ?", options: ["Carbone 14", "Uranium 235", "Plutonium 239", "Cobalt 60"], answer: "Carbone 14" },
    { question: "Quel physicien a formulé les lois du mouvement et de la gravitation universelle ?", options: ["Albert Einstein", "Isaac Newton", "Galilée", "Johannes Kepler"], answer: "Isaac Newton" },
    { question: "Quel type de rayonnement est émis par une radiographie médicale ?", options: ["Rayons infrarouges", "Rayons X", "Ondes radio", "Rayons gamma"], answer: "Rayons X" },
    { question: "Quel est le pH d'une solution neutre à 25 °C ?", options: ["0", "7", "14", "5"], answer: "7" }
  ],
  technologie: [
    { question: "Que signifie l'acronyme HTML ?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Main Logic", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
    { question: "Quel langage est principalement utilisé pour styliser les pages web ?", options: ["Python", "HTML", "CSS", "C++"], answer: "CSS" },
    { question: "Qui a cofondé l'entreprise Microsoft ?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], answer: "Bill Gates" },
    { question: "Que signifie CPU ?", options: ["Central Processing Unit", "Computer Personal Unit", "Control Power Utility", "Central Performance User"], answer: "Central Processing Unit" },
    { question: "Quel système d'exploitation open source a été créé par Linus Torvalds ?", options: ["Windows", "macOS", "Linux", "iOS"], answer: "Linux" },
    { question: "Quel protocole sécurisé est utilisé pour surfer sur un web chiffré ?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: "HTTPS" },
    { question: "Quel est le nom du réseau mondial décentralisé d'ordinateurs interconnectés ?", options: ["Intranet", "Internet", "Ethernet", "ARPANET"], answer: "Internet" },
    { question: "Quel langage de programmation est le plus utilisé pour l'intelligence artificielle et le machine learning ?", options: ["HTML", "Python", "CSS", "SQL"], answer: "Python" },
    { question: "Que signifie l'acronyme RAM en informatique ?", options: ["Read Access Memory", "Random Access Memory", "Rapid Active Module", "Run Application Memory"], answer: "Random Access Memory" },
    { question: "Quel réseau social a été fondé par Mark Zuckerberg en 2004 ?", options: ["Twitter", "Instagram", "Facebook", "LinkedIn"], answer: "Facebook" },
    { question: "Quel composant informatique sert de mémoire de stockage permanente principale ?", options: ["RAM", "Disque dur / SSD", "Processeur", "Carte mère"], answer: "Disque dur / SSD" },
    { question: "Quel est le principal langage utilisé pour dynamiser et rendre interactives les pages web ?", options: ["JavaScript", "Python", "C#", "PHP"], answer: "JavaScript" },
    { question: "Quel fabricant a créé la célèbre gamme de smartphones iPhone ?", options: ["Samsung", "Google", "Apple", "Huawei"], answer: "Apple" },
    { question: "Que signifie l'extension de fichier '.pdf' ?", options: ["Portable Document Format", "Personal Digital File", "Printable Data Format", "Program Document File"], answer: "Portable Document Format" },
    { question: "Quel outil de versioning très populaire a été créé par Linus Torvalds en 2005 ?", options: ["SVN", "Git", "Mercurial", "CVS"], answer: "Git" },
    { question: "Quel est le nom du moteur de recherche créé par Larry Page et Sergey Brin ?", options: ["Bing", "Yahoo", "Google", "DuckDuckGo"], answer: "Google" },
    { question: "Quel langage de balisage est utilisé pour structurer les données et stocker des informations de configuration (comme dans Firebase ou API) ?", options: ["JSON", "CSS", "SQL", "C++"], answer: "JSON" },
    { question: "Quel est le nom du premier navigateur web grand public populaire sorti dans les années 1990 ?", options: ["Netscape Navigator", "Google Chrome", "Mozilla Firefox", "Safari"], answer: "Netscape Navigator" },
    { question: "Que signifie SSD ?", options: ["Solid State Drive", "Super Safe Disk", "System Storage Device", "Serial Static Data"], answer: "Solid State Drive" },
    { question: "Quel type de base de données Firebase utilise-t-il pour stocker les documents sous forme de collections ?", options: ["MySQL", "Firestore / Realtime Database", "Oracle", "PostgreSQL"], answer: "Firestore / Realtime Database" },
    { question: "Quel acronyme désigne l'intelligence artificielle en anglais ?", options: ["AI", "IA", "MI", "CI"], answer: "AI" },
    { question: "Quel appareil relie plusieurs réseaux informatiques entre eux et achemine les paquets de données ?", options: ["Un switch", "Un routeur", "Un modem", "Un hub"], answer: "Un routeur" },
    { question: "Quel langage de requête est utilisé pour interagir avec les bases de données relationnelles ?", options: ["HTML", "SQL", "Python", "XML"], answer: "SQL" },
    { question: "Quel est le nom du robot humanoïde emblématique développé par Boston Dynamics ?", options: ["Asimo", "Atlas", "Pepper", "Sophia"], answer: "Atlas" },
    { question: "Quelle est l'unité de base de données informatique composée de 8 bits ?", options: ["Un octet (Byte)", "Un kilo", "Un pixel", "Un hertz"], answer: "Un octet (Byte)" },
    { question: "Quel protocole de messagerie est utilisé pour envoyer des e-mails ?", options: ["SMTP", "POP3", "IMAP", "HTTP"], answer: "SMTP" },
    { question: "Quel est le nom de l'assistant virtuel intelligent intégré aux appareils Apple ?", options: ["Alexa", "Cortana", "Siri", "Google Assistant"], answer: "Siri" },
    { question: "Quelle entreprise fabrique les cartes graphiques GeForce très populaires auprès des gamers et pour l'IA ?", options: ["AMD", "Intel", "NVIDIA", "Qualcomm"], answer: "NVIDIA" },
    { question: "Quel est le nom de la plateforme d'hébergement de code source la plus populaire au monde acquise par Microsoft ?", options: ["GitLab", "Bitbucket", "GitHub", "SourceForge"], answer: "GitHub" },
    { question: "Quel terme désigne un logiciel malveillant qui chiffre les données d'un utilisateur et exige une rançon ?", options: ["Adware", "Ransomware (Rongiciel)", "Spyware", "Trojan"], answer: "Ransomware (Rongiciel)" },
    { question: "Quel langage de programmation orienté objet a été développé par Sun Microsystems et possède une tasse de café pour logo ?", options: ["C++", "Java", "Python", "Ruby"], answer: "Java" },
    { question: "Que signifie l'acronyme USB ?", options: ["Universal Serial Bus", "Uniform System Board", "Ultra Speed Bridge", "Unencrypted Secure Backup"], answer: "Universal Serial Bus" },
    { question: "Quel est le nom du système de noms de domaine qui traduit les adresses IP en noms de sites lisibles ?", options: ["DHCP", "DNS", "TCP", "IP"], answer: "DNS" },
    { question: "Quelle technologie sans fil à courte portée permet le paiement sans contact avec un smartphone ?", options: ["Bluetooth", "NFC", "Wi-Fi", "Infrarouge"], answer: "NFC" }
  ],
  geographie: [
    { question: "Quelle est la capitale de la RDC ?", options: ["Lubumbashi", "Goma", "Kinshasa", "Kisangani"], answer: "Kinshasa" },
    { question: "Quel est le plus grand océan de la Terre ?", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], answer: "Pacifique" },
    { question: "Dans quel continent se trouve le désert du Sahara ?", options: ["Asie", "Afrique", "Amérique du Sud", "Australie"], answer: "Afrique" },
    { question: "Quel est le plus long fleuve du monde ?", options: ["Le Nil", "L'Amazone", "Le Fleuve Congo", "Le Mississippi"], answer: "L'Amazone" },
    { question: "Quelle est la capitale de la France ?", options: ["Lyon", "Marseille", "Paris", "Nice"], answer: "Paris" },
    { question: "Quel pays a la plus grande population au monde ?", options: ["États-Unis", "Inde", "Chine", "Russie"], answer: "Inde" },
    { question: "Quel est le plus grand pays du monde en superficie ?", options: ["Canada", "Chine", "États-Unis", "Russie"], answer: "Russie" },
    { question: "Dans quel pays se trouve la ville de Lubumbashi ?", options: ["Zambie", "RDC", "Angola", "Tanzanie"], answer: "RDC" },
    { question: "Quelle est la capitale du Japon ?", options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], answer: "Tokyo" },
    { question: "Quel canal artificiel relie la mer Méditerranée à la mer Rouge ?", options: ["Canal de Panama", "Canal de Suez", "Canal de Kiel", "Canal de Corinthe"], answer: "Canal de Suez" },
    { question: "Quel est le plus petit pays indépendant du monde ?", options: ["Monaco", "Liechtenstein", "Vatican", "Saint-Marin"], answer: "Vatican" },
    { question: "Quelle est la plus haute montagne du monde ?", options: ["Kilimandjaro", "Mont Blanc", "Everest", "K2"], answer: "Everest" },
    { question: "Quel fleuve traverse la ville de Paris ?", options: ["La Loire", "Le Rhône", "La Seine", "La Garonne"], answer: "La Seine" },
    { question: "Quel pays d'Afrique est surnommé 'Le géant de l'Afrique' en raison de sa population ?", options: ["L'Égypte", "L'Afrique du Sud", "Le Nigeria", "Le Kenya"], answer: "Le Nigeria" },
    { question: "Quelle est la capitale du Canada ?", options: ["Toronto", "Vancouver", "Ottawa", "Montréal"], answer: "Ottawa" },
    { question: "Dans quel océan se trouve l'île de Madagascar ?", options: ["Océan Atlantique", "Océan Pacifique", "Océan Indien", "Océan Arctique"], answer: "Océan Indien" },
    { question: "Quel désert froid est situé en Asie centrale, cheval sur la Chine et la Mongolie ?", options: ["Désert de Gobi", "Désert du Kalahari", "Désert d'Atacama", "Désert du Namib"], answer: "Désert de Gobi" },
    { question: "Quelle est la capitale de l'Australie ?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: "Canberra" },
    { question: "Quel pays européen est connu pour avoir une forme de botte ?", options: ["L'Espagne", "La Grèce", "L'Italie", "Le Portugal"], answer: "L'Italie" },
    { question: "Quel lac situé entre la RDC et le Rwanda est l'un des Grands Lacs d'Afrique ?", options: ["Lac Victoria", "Lac Tanganyika", "Lac Kivu", "Lac Malawi"], answer: "Lac Kivu" },
    { question: "Quelle est la plus grande île du monde en superficie (hors Antarctique) ?", options: ["Madagascar", "Groenland", "Bornéo", "Sumatra"], answer: "Groenland" },
    { question: "Quel détroit sépare l'Espagne du Maroc (l'Europe de l'Afrique) ?", options: ["Détroit de Malacca", "Détroit de Gibraltar", "Détroit de Béring", "Détroit du Bosphore"], answer: "Détroit de Gibraltar" },
    { question: "Quel est le fleuve le plus long d'Afrique après le Nil ?", options: ["Le Niger", "Le Zambèze", "Le Fleuve Congo", "L'Orange"], answer: "Le Fleuve Congo" },
    { question: "Quelle est la capitale du Brésil ?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], answer: "Brasília" },
    { question: "Combien de pays composent l'Afrique de l'Est (communauté EAC environ) ?", options: ["5", "8", "15", "20"], answer: "8" },
    { question: "Quel est le point le plus bas de la surface de la Terre (dépression terrestre) ?", options: ["La Mer Morte", "La Fosse des Mariannes", "La Vallée de la Mort", "Le lac Assal"], answer: "La Mer Morte" },
    { question: "Quelle est la capitale de l'Afrique du Sud (siège du gouvernement) ?", options: ["Le Cap", "Pretoria", "Johannesbourg", "Durban"], answer: "Pretoria" },
    { question: "Quel pays est à la fois situé en Europe et en Asie ?", options: ["La Turquie", "L'Égypte", "Le Mexique", "Le Maroc"], answer: "La Turquie" },
    { question: "Quel est le nom de la chaîne de montagnes qui sépare l'Europe de l'Asie ?", options: ["Les Alpes", "Les Pyrénées", "L'Oural", "L'Himalaya"], answer: "L'Oural" },
    { question: "Quelle est la capitale de l'Argentine ?", options: ["Santiago", "Buenos Aires", "Bogota", "Lima"], answer: "Buenos Aires" },
    { question: "Quel pays possède la plus longue coastline (côte maritime) au monde ?", options: ["L'Australie", "Le Canada", "La Russie", "Les États-Unis"], answer: "Le Canada" },
    { question: "Quel est le nom de la cascade géante située à la frontière entre la Zambie et le Zimbabwe ?", options: ["Chutes du Niagara", "Chutes Victoria", "Chutes d'Iguazú", "Chutes d'Angel"], answer: "Chutes Victoria" }
  ],
  culture: [
    { question: "Qui a peint la célèbre Joconde (Mona Lisa) ?", options: ["Van Gogh", "Léonard de Vinci", "Picasso", "Monet"], answer: "Léonard de Vinci" },
    { question: "Quel instrument possède 6 cordes ?", options: ["Violon", "Piano", "Guitare", "Flûte"], answer: "Guitare" },
    { question: "Combien de couleurs composent un arc-en-ciel ?", options: ["5", "6", "7", "8"], answer: "7" },
    { question: "Quel auteur a écrit 'Les Misérables' ?", options: ["Émile Zola", "Victor Hugo", "Albert Camus", "Molière"], answer: "Victor Hugo" },
    { question: "Quel est le style musical originaire de Jamaïque popularisé par Bob Marley ?", options: ["Jazz", "Blues", "Reggae", "Salsa"], answer: "Reggae" },
    { question: "Quel cinéaste a réalisé le film 'Titanic' sorti en 1997 ?", options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Quentin Tarantino"], answer: "James Cameron" },
    { question: "Dans quelle ville se trouve la célèbre tour Eiffel ?", options: ["Londres", "Rome", "Paris", "Berlin"], answer: "Paris" },
    { question: "Quel artiste peintre néerlandais est célèbre pour s'être coupé une partie de l'oreille ?", options: ["Rembrandt", "Vincent van Gogh", "Johannes Vermeer", "Piet Mondrian"], answer: "Vincent van Gogh" },
    { question: "Quel célèbre détective de fiction a été créé par Arthur Conan Doyle ?", options: ["Hercule Poirot", "Sherlock Holmes", "Commissaire Maigret", "Arsène Lupin"], answer: "Sherlock Holmes" },
    { question: "Quel genre musical et culturel est né à Kinshasa et Brazzaville (Rumba congolaise) ?", options: ["Afrobeat", "Rumba / Soukous", "Highlife", "Kwaito"], answer: "Rumba / Soukous" },
    { question: "Qui a écrit la pièce de théâtre classique 'Le Bourgeois gentilhomme' ?", options: ["Racine", "Corneille", "Molière", "La Fontaine"], answer: "Molière" },
    { question: "Quel pays est le berceau de la pizza et de la Renaissance ?", options: ["L'Espagne", "La France", "L'Italie", "La Grèce"], answer: "L'Italie" },
    { question: "Quel célèbre sculpteur a réalisé la statue du 'Penseur' ?", options: ["Auguste Rodin", "Michel-Ange", "Alberto Giacometti", "Camille Claudel"], answer: "Auguste Rodin" },
    { question: "Quel est le nom du festival de cinéma international qui se déroule chaque année sur la Côte d'Azur en France ?", options: ["Festival de Berlin", "Mostra de Venise", "Festival de Cannes", "Festival de Sundance"], answer: "Festival de Cannes" },
    { question: "Quel style de musique électronique et urbaine domine les hits dancefloor en Afrique centrale et de l'Est (ex: Katanga/Kinshasa) ?", options: ["Afro House / Amapiano", "Country", "Bluegrass", "Metal symphonique"], answer: "Afro House / Amapiano" },
    { question: "Quel écrivain français est l'auteur du 'Petit Prince' ?", options: ["Antoine de Saint-Exupéry", "Jules Verne", "Alexandre Dumas", "Albert Camus"], answer: "Antoine de Saint-Exupéry" },
    { question: "Quel groupe de rock britannique a sorti l'album légendaire 'Abbey Road' ?", options: ["The Rolling Stones", "The Beatles", "Queen", "Pink Floyd"], answer: "The Beatles" },
    { question: "Quel musée parisien abrite la Joconde ?", options: ["Musée d'Orsay", "Centre Pompidou", "Musée du Louvre", "Musée Rodin"], answer: "Musée du Louvre" },
    { question: "Quel prix international récompense chaque année des auteurs et scientifiques d'exception (fondé par Alfred Nobel) ?", options: ["Prix Pulitzer", "Prix Nobel", "Prix Goncourt", "Oscar"], answer: "Prix Nobel" },
    { question: "Quel est le nom du sorcier borgne ou des aventures du magicien dans la saga littéraire de J.K. Rowling ?", options: ["Le Seigneur des Anneaux", "Harry Potter", "Percy Jackson", "Narnia"], answer: "Harry Potter" },
    { question: "Quel peintre espagnol est l'un des fondateurs du mouvement cubiste ?", options: ["Salvador Dalí", "Pablo Picasso", "Joan Miró", "Diego Velázquez"], answer: "Pablo Picasso" },
    { question: "Dans quelle mythologie trouve-t-on les dieux Zeus, Poséidon et Hadès ?", options: ["Mythologie romaine", "Mythologie égyptienne", "Mythologie grecque", "Mythologie nordique"], answer: "Mythologie grecque" }
  ],
  sport: [
    { question: "Tous les combien d'années ont lieu les JO d'été ?", options: ["2 ans", "3 ans", "4 ans", "5 ans"], answer: "4 ans" },
    { question: "Combien de joueurs composent une équipe de football sur le terrain ?", options: ["9", "10", "11", "12"], answer: "11" },
    { question: "Quel pays a remporté la Coupe du Monde de football en 2022 ?", options: ["France", "Brésil", "Argentine", "Allemagne"], answer: "Argentine" },
    { question: "Quel joueur est considéré comme le 'Roi Pelé', légende brésilienne du football ?", options: ["Maradona", "Pelé", "Zidane", "Ronaldo"], answer: "Pelé" },
    { question: "Quel sport pratique-t-on avec une petite balle jaune et une raquette sur une table ?", options: ["Tennis", "Badminton", "Tennis de table (Ping-pong)", "Squash"], answer: "Tennis de table (Ping-pong)" },
    { question: "Combien de points vaut un panier réussi derrière la ligne des trois points au basketball NBA ?", options: ["1 point", "2 points", "3 points", "4 points"], answer: "3 points" },
    { question: "Quel pays a inventé le rugby moderne ?", options: ["La France", "Le Royaume-Uni (Angleterre)", "L'Australie", "La Nouvelle-Zélande"], answer: "Le Royaume-Uni (Angleterre)" },
    { question: "Quel tournoi de tennis du Grand Chelem se joue sur terre battue à Paris ?", options: ["Wimbledon", "US Open", "Roland-Garros", "Open d'Australie"], answer: "Roland-Garros" },
    { question: "Quelle équipe nationale de rugby est surnommée les 'All Blacks' ?", options: ["Australie", "Afrique du Sud", "Nouvelle-Zélande", "Angleterre"], answer: "Nouvelle-Zélande" },
    { question: "Quel est le nom de la course cycliste par étapes la plus célèbre du monde qui se déroule en France ?", options: ["Giro d'Italia", "Tour de France", "Vuelta", "Paris-Roubaix"], answer: "Tour de France" },
    { question: "Combien de joueurs composent une équipe de basketball sur le terrain par équipe ?", options: ["4", "5", "6", "7"], answer: "5" },
    { question: "Quel boxeur américain légendaire a prononcé la phrase 'Vole comme un papillon, pique comme une abeille' ?", options: ["Mike Tyson", "Muhammad Ali", "Floyd Mayweather", "George Foreman"], answer: "Muhammad Ali" },
    { question: "Dans quel sport utilise-t-on un 'puck' (palais) sur de la glace ?", options: ["Hockey sur gazon", "Hockey sur glace", "Curling", "Patinage artistique"], answer: "Hockey sur glace" },
    { question: "Quel pays a accueilli la Coupe du Monde de football en 2010 (remportée par l'Espagne) ?", options: ["Brésil", "Afrique du Sud", "Allemagne", "Qatar"], answer: "Afrique du Sud" },
    { question: "Quel athlète jamaïcain détient le record du monde du 100 mètres ?", options: ["Usain Bolt", "Yohan Blake", "Asafa Powell", "Noah Lyles"], answer: "Usain Bolt" },
    { question: "Quel sport de combat d'origine japonaise signifie 'la voie de la souplesse' ?", options: ["Karaté", "Judo", "Taekwondo", "Aikido"], answer: "Judo" },
    { question: "Combien de trous y a-t-il sur un parcours standard de golf ?", options: ["9", "12", "18", "20"], answer: "18" },
    { question: "Quel club de football espagnol est surnommé 'Los Blancos' ou le Real ?", options: ["FC Barcelone", "Real Madrid", "Atlético de Madrid", "Valence CF"], answer: "Real Madrid" },
    { question: "Quel pilote de Formule 1 détient le record du plus grand nombre de titres mondiaux (à égalité avec Michael Schumacher) ?", options: ["Ayrton Senna", "Lewis Hamilton", "Max Verstappen", "Sebastian Vettel"], answer: "Lewis Hamilton" },
    { question: "Quel est le nom de la compétition continentale de football en Afrique (CAN) ?", options: ["Coupe d'Afrique des Nations", "CAF Champions League", "African Cup", "Supercoupe d'Afrique"], answer: "Coupe d'Afrique des Nations" }
  ]
};


// ==========================================
// 6. LOGIQUE DE NAVIGATION DES ONGLETS
// ==========================================
function switchTab(tabName) {
  const levelsTab = document.getElementById('levels-tab');
  const categoriesTab = document.getElementById('categories-tab');
  const btnLevels = document.getElementById('tab-levels-btn');
  const btnCategories = document.getElementById('tab-categories-btn');

  if (tabName === 'levels') {
    levelsTab.style.display = 'block';
    categoriesTab.style.display = 'none';
    btnLevels.classList.add('active');
    btnCategories.classList.remove('active');
  } else {
    levelsTab.style.display = 'none';
    categoriesTab.style.display = 'block';
    btnCategories.classList.add('active');
    btnLevels.classList.remove('active');
  }
}


// ==========================================
// 7. LANCEMENT DU QUIZ & GESTION DES QUESTIONS
// ==========================================
function startQuiz(mode, identifier) {
  currentMode = mode;
  currentIdentifier = identifier;
  score = 0;
  currentQuestionIndex = 0;

  if (mode === 'level') {
    currentQuestions = [...levelsData[identifier]];
    document.getElementById('mode-indicator').innerText = `Niveau ${identifier}`;
  } else {
    currentQuestions = [...questionsData[identifier]];
    // Mélange aléatoire des questions de la catégorie
    currentQuestions.sort(() => Math.random() - 0.5);
    // Limiter à 10 questions par partie de catégorie
    currentQuestions = currentQuestions.slice(0, 10);
    document.getElementById('mode-indicator').innerText = `Catégorie : ${identifier.toUpperCase()}`;
  }

  document.getElementById('selection-screen').style.display = 'none';
  document.getElementById('result-box').style.display = 'none';
  document.getElementById('quiz-box').style.display = 'block';

  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  if (currentQuestionIndex >= currentQuestions.length) {
    endQuiz();
    return;
  }

  const q = currentQuestions[currentQuestionIndex];
  document.getElementById('question-number').innerText = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
  document.getElementById('question-text').innerText = q.question;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  // Mélange des options de réponse
  const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

  shuffledOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.innerText = option;
    btn.onclick = () => selectAnswer(btn, option, q.answer);
    optionsContainer.appendChild(btn);
  });

  startTimer();
}


// ==========================================
// 8. GESTION DU CHRONOMÈTRE
// ==========================================
function startTimer() {
  timeLeft = 15;
  const timerBar = document.getElementById('timer-bar');
  timerBar.style.width = '100%';
  timerBar.style.backgroundColor = 'var(--secondary-color)';

  timer = setInterval(() => {
    timeLeft -= 0.1;
    const percentage = (timeLeft / 15) * 100;
    timerBar.style.width = `${percentage}%`;

    if (timeLeft <= 5) {
      timerBar.style.backgroundColor = 'var(--danger-color)';
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 100);
}

function handleTimeout() {
  const options = document.querySelectorAll('.btn-option');
  options.forEach(btn => {
    btn.disabled = true;
    const q = currentQuestions[currentQuestionIndex];
    if (btn.innerText === q.answer) {
      btn.classList.add('correct');
    }
  });

  playDefeatSound();

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1500);
}


// ==========================================
// 9. VALIDATION DES RÉPONSES
// ==========================================
function selectAnswer(selectedBtn, chosen, correct) {
  clearInterval(timer);
  const options = document.querySelectorAll('.btn-option');
  options.forEach(btn => btn.disabled = true);

  if (chosen === correct) {
    selectedBtn.classList.add('correct');
    score += 10;
    coins += 5;
    document.getElementById('coin-count').innerText = coins;
  } else {
    selectedBtn.classList.add('wrong');
    playDefeatSound();
    options.forEach(btn => {
      if (btn.innerText === correct) {
        btn.classList.add('correct');
      }
    });
  }

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1500);
}


// ==========================================
// 10. FIN DU QUIZ & AUTOMATISATION DU NIVEAU SUIVANT
// ==========================================
function endQuiz() {
  clearInterval(timer);
  document.getElementById('quiz-box').style.display = 'none';
  document.getElementById('result-box').style.display = 'block';

  const maxScore = currentQuestions.length * 10;
  const passed = score >= maxScore / 2;

  if (passed) {
    playVictorySound();
    document.getElementById('result-title').innerText = "🎉 Félicitations ! Partie Gagnée !";
    document.getElementById('encouragement-msg').innerText = "Excellent travail ! Vous maîtrisez parfaitement ce sujet.";
  } else {
    playDefeatSound();
    document.getElementById('result-title').innerText = "💡 Dommage ! Partie Terminée.";
    document.getElementById('encouragement-msg').innerText = "Ne lâchez rien ! Retentez votre chance pour progresser.";
  }

  document.getElementById('final-score').innerText = `Score : ${score} / ${maxScore}`;
  document.getElementById('high-score').innerHTML = `Pièces gagnées : +${coins} <img src="assets/images/coin.png" alt="Pièce" style="width: 20px; vertical-align: middle;">`;

  // Gestion dynamique de l'automatisation du niveau suivant
  setupResultActions();
}

function setupResultActions() {
  const resultActionsDiv = document.querySelector('.result-actions');
  
  // Supprimer l'ancien bouton 'Niveau Suivant' s'il existe déjà pour éviter les doublons
  const existingNextBtn = document.getElementById('btn-next-level');
  if (existingNextBtn) {
    existingNextBtn.remove();
  }

  // Vérifier si nous sommes en mode 'level' et que le niveau actuel est < 10
  if (currentMode === 'level' && currentIdentifier < 10) {
    const nextLevelBtn = document.createElement('button');
    nextLevelBtn.id = 'btn-next-level';
    nextLevelBtn.className = 'btn-home'; // Utilise le style d'un bouton principal
    nextLevelBtn.innerHTML = `⏩ Niveau ${currentIdentifier + 1} Suivant`;
    nextLevelBtn.onclick = () => goToNextLevel();
    
    // Insérer le bouton juste avant le bouton Accueil
    resultActionsDiv.appendChild(nextLevelBtn);
  }
}

function goToNextLevel() {
  if (currentIdentifier < 10) {
    startQuiz('level', currentIdentifier + 1);
  }
}

function restartSameGame() {
  startQuiz(currentMode, currentIdentifier);
}

function resetQuiz() {
  clearInterval(timer);
  document.getElementById('quiz-box').style.display = 'none';
  document.getElementById('result-box').style.display = 'none';
  document.getElementById('selection-screen').style.display = 'block';
  
  // Nettoyer le bouton de niveau suivant si on retourne à l'accueil
  const existingNextBtn = document.getElementById('btn-next-level');
  if (existingNextBtn) {
    existingNextBtn.remove();
  }
}