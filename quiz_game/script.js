// ==========================================
// 1. SYSTÈME AUDIO (Web Audio API native)
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
  const notes = [261.63, 329.63, 392.00, 523.25]; // Accord Do Majeur
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
  const notes = [300, 260, 220, 180]; // Fréquences descendantes
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
// 2. BANQUE DE DONNÉES - NIVEAUX (1 À 10)
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
// 3. BANQUE DE DONNÉES - CATÉGORIES
// ==========================================
const questionsData = {
  histoire: [
    { question: "En quelle année est arrivée l'indépendance de la RDC ?", options: ["1960", "1958", "1965", "1970"], answer: "1960" },
    { question: "Qui fut le premier Président de la RDC ?", options: ["Joseph Kasa-Vubu", "Patrice Lumumba", "Mobutu Sese Seko", "L.D. Kabila"], answer: "Joseph Kasa-Vubu" },
    { question: "En quelle année s'est terminée la Seconde Guerre mondiale ?", options: ["1918", "1939", "1945", "1950"], answer: "1945" },
    { question: "Qui était le premier empereur de Rome ?", options: ["Jules César", "Auguste", "Néron", "Marc Aurèle"], answer: "Auguste" },
    { question: "Quel grand empire antique a construit les pyramides de Gizeh ?", options: ["Empire Romain", "Empire Grec", "Égypte antique", "Empire Babylonien"], answer: "Égypte antique" }
  ],
  sciences: [
    { question: "Quel est le symbole chimique de l'eau ?", options: ["CO2", "H2O", "O2", "NaCl"], answer: "H2O" },
    { question: "Quelle planète est surnommée la 'Planète Rouge' ?", options: ["Jupiter", "Mars", "Vénus", "Saturne"], answer: "Mars" },
    { question: "Quel est l'organe principal du système circulatoire humain ?", options: ["Le poumon", "Le cerveau", "Le cœur", "Le foie"], answer: "Le cœur" },
    { question: "Quelle est la vitesse de la lumière dans le vide ?", options: ["300 000 km/s", "150 000 km/s", "1 000 000 km/s", "30 000 km/s"], answer: "300 000 km/s" }
  ],
  technologie: [
    { question: "Que signifie l'acronyme HTML ?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Main Logic", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
    { question: "Quel langage est principalement utilisé pour styliser les pages web ?", options: ["Python", "HTML", "CSS", "C++"], answer: "CSS" },
    { question: "Qui a cofondé l'entreprise Microsoft ?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], answer: "Bill Gates" },
    { question: "Que signifie CPU ?", options: ["Central Processing Unit", "Computer Personal Unit", "Control Power Utility", "Central Performance User"], answer: "Central Processing Unit" }
  ],
  geographie: [
    { question: "Quelle est la capitale de la RDC ?", options: ["Lubumbashi", "Goma", "Kinshasa", "Kisangani"], answer: "Kinshasa" },
    { question: "Quel est le plus grand océan de la Terre ?", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], answer: "Pacifique" },
    { question: "Dans quel continent se trouve le désert du Sahara ?", options: ["Asie", "Afrique", "Amérique du Sud", "Australie"], answer: "Afrique" },
    { question: "Quel est le plus long fleuve du monde ?", options: ["Le Nil", "L'Amazone", "Le Fleuve Congo", "Le Mississippi"], answer: "L'Amazone" }
  ],
  culture: [
    { question: "Qui a peint la célèbre Joconde (Mona Lisa) ?", options: ["Van Gogh", "Léonard de Vinci", "Picasso", "Monet"], answer: "Léonard de Vinci" },
    { question: "Quel instrument possède 6 cordes ?", options: ["Violon", "Piano", "Guitare", "Flûte"], answer: "Guitare" },
    { question: "Combien de couleurs composent un arc-en-ciel ?", options: ["5", "6", "7", "8"], answer: "7" }
  ],
  sport: [
    { question: "Tous les combien d'années ont lieu les JO d'été ?", options: ["2 ans", "3 ans", "4 ans", "5 ans"], answer: "4 ans" },
    { question: "Combien de joueurs composent une équipe de football ?", options: ["9", "10", "11", "12"], answer: "11" },
    { question: "Quel pays a remporté la Coupe du Monde de football en 2022 ?", options: ["France", "Brésil", "Argentine", "Allemagne"], answer: "Argentine" }
  ]
};

// ==========================================
// 4. ÉTATS ET ÉLÉMENTS DU JEU
// ==========================================
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let currentModeTitle = "";
let currentStorageKey = "";
let lastGameType = "";
let lastTarget = "";

// TIMER VARIABLES
let timerInterval;
const QUESTION_TIME_LIMIT = 15; // 15 secondes par question

// GESTION DES ONGLETS
function switchTab(tabName) {
  const levelsTab = document.getElementById("levels-tab");
  const categoriesTab = document.getElementById("categories-tab");
  const levelsBtn = document.getElementById("tab-levels-btn");
  const categoriesBtn = document.getElementById("tab-categories-btn");

  if (tabName === "levels") {
    levelsTab.style.display = "block";
    categoriesTab.style.display = "none";
    levelsBtn.classList.add("active");
    categoriesBtn.classList.remove("active");
  } else {
    levelsTab.style.display = "none";
    categoriesTab.style.display = "block";
    categoriesBtn.classList.add("active");
    levelsBtn.classList.remove("active");
  }
}

// DÉMARRAGE DU QUIZ
function startQuiz(type, target) {
  lastGameType = type;
  lastTarget = target;

  if (type === 'level') {
    currentQuestions = shuffleArray([...levelsData[target]]);
    currentModeTitle = `Niveau ${target}`;
    currentStorageKey = `quiz_best_level_${target}`;
  } else {
    const rawQuestions = [...questionsData[target]];
    currentQuestions = shuffleArray(rawQuestions).slice(0, 5);
    currentModeTitle = target.charAt(0).toUpperCase() + target.slice(1);
    currentStorageKey = `quiz_best_cat_${target}`;
  }

  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("selection-screen").style.display = "none";
  document.getElementById("quiz-box").style.display = "block";
  document.getElementById("result-box").style.display = "none";

  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  const q = currentQuestions[currentQuestionIndex];

  document.getElementById("mode-indicator").innerText = currentModeTitle;
  document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} / ${currentQuestions.length}`;
  document.getElementById("coin-count").innerText = score;
  document.getElementById("question-text").innerText = q.question;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  const shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.innerText = option;

    // Utilisation d'un listener 'click' standard
    btn.addEventListener("click", () => handleSelectOption(btn, option, q.answer));

    optionsContainer.appendChild(btn);
  });

  startTimer(q.answer);
}

function startTimer(correctAnswer) {
  let timeLeft = QUESTION_TIME_LIMIT;
  const timerBar = document.getElementById("timer-bar");
  
  timerBar.style.width = "100%";
  timerBar.style.backgroundColor = "var(--secondary-color)";

  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    const percentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;
    timerBar.style.width = `${Math.max(0, percentage)}%`;

    if (percentage < 30) {
      timerBar.style.backgroundColor = "var(--danger-color)";
    } else if (percentage < 60) {
      timerBar.style.backgroundColor = "var(--gold-color)";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Temps écoulé -> réponse manquée
      handleSelectOption(null, null, correctAnswer);
    }
  }, 100);
}

function handleSelectOption(selectedBtn, selectedOption, correctOption) {
  clearInterval(timerInterval);

  const allBtns = document.querySelectorAll(".btn-option");
  allBtns.forEach(btn => btn.disabled = true);

  if (selectedOption === correctOption) {
    if (selectedBtn) selectedBtn.classList.add("correct");
    score += 10;
  } else {
    if (selectedBtn) selectedBtn.classList.add("wrong");
    // Afficher la bonne réponse
    allBtns.forEach(btn => {
      if (btn.innerText === correctOption) {
        btn.classList.add("correct");
      }
    });
  }

  document.getElementById("coin-count").innerText = score;

  // Pause d'une seconde pour observer la réponse avant la question suivante
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";

  const totalQuestions = currentQuestions.length;
  const maxCoins = totalQuestions * 10;
  const successThreshold = (Math.ceil(totalQuestions / 2)) * 10;

  const resultTitleElem = document.getElementById("result-title");
  const finalScoreElem = document.getElementById("final-score");
  const encouragementMsgElem = document.getElementById("encouragement-msg");

  finalScoreElem.innerHTML = `${currentModeTitle} terminé ! Vous avez gagné : <img src="images/coin.png" class="coin-img" alt="🪙"> <strong>${score} / ${maxCoins}</strong> Pièces d'Or`;

  if (score < successThreshold) {
    playDefeatSound();
    resultTitleElem.innerText = "❌ Tu as échoué !";
    resultTitleElem.style.color = "#e74c3c";
    encouragementMsgElem.innerText = "Ne te décourage pas ! C'est en faisant des erreurs qu'on apprend. Relève le défi, réessaie pour accumuler plus de pièces ! 💪";
  } else {
    playVictorySound();
    resultTitleElem.innerText = "🎉 Félicitations, c'est gagné !";
    resultTitleElem.style.color = "#27ae60";
    encouragementMsgElem.innerText = "Super travail ! Tu maîtrises bien ce niveau. Continue sur cette lancée ! 🚀";
  }

  const bestScore = parseInt(localStorage.getItem(currentStorageKey) || 0);

  if (score > bestScore) {
    localStorage.setItem(currentStorageKey, score);
    document.getElementById("high-score").innerHTML = `🏆 Nouveau record personnel : <img src="images/coin.png" class="coin-img" alt="🪙"> <strong>${score}</strong> Pièces d'Or !`;
  } else {
    document.getElementById("high-score").innerHTML = `Meilleur trésor enregistré : <img src="images/coin.png" class="coin-img" alt="🪙"> ${bestScore} Pièces d'Or`;
  }
}

function restartSameGame() {
  if (lastGameType && lastTarget) {
    startQuiz(lastGameType, lastTarget);
  } else {
    resetQuiz();
  }
}

function resetQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "none";
  document.getElementById("selection-screen").style.display = "block";
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}