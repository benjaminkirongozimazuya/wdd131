// 1. BASE DE DONNÉES DES NIVEAUX (Maths, Physique, Géométrie, Psycho-technique)
const levelsData = {
  1: [
    { question: "Maths : Combien font 7 x 8 ?", options: ["54", "56", "64", "49"], answer: "56" },
    { question: "Géométrie : Combien de côtés possède un hexagone ?", options: ["5", "6", "7", "8"], answer: "6" },
    { question: "Psycho-technique : Complétez la suite : 2, 4, 6, 8, ...", options: ["9", "10", "11", "12"], answer: "10" },
    { question: "Physique : Quel est l'état de l'eau pure à 100°C sous pression normale ?", options: ["Solide", "Liquide", "Gazeux", "Plasma"], answer: "Gazeux" }
  ],
  2: [
    { question: "Maths : Si x + 5 = 12, que vaut x ?", options: ["5", "6", "7", "8"], answer: "7" },
    { question: "Physique : Quelle est l'unité de mesure de la force dans le Système International ?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: "Newton" },
    { question: "Géométrie : Quelle est la somme des angles internes d'un triangle ?", options: ["90°", "180°", "360°", "270°"], answer: "180°" },
    { question: "Psycho-technique : Quel est l'intrus parmi ces formes ?", options: ["Carré", "Triangle", "Sphère", "Rectangle"], answer: "Sphère" }
  ],
  3: [
    { question: "Maths : Calculez : 15% de 200.", options: ["20", "25", "30", "35"], answer: "30" },
    { question: "Géométrie : Quel est le périmètre d'un carré de côté 6 cm ?", options: ["12 cm", "24 cm", "36 cm", "18 cm"], answer: "24 cm" },
    { question: "Physique : Quelle force attire les objets vers le centre de la Terre ?", options: ["La réfraction", "La gravité", "La magnétostriction", "La tension de surface"], answer: "La gravité" },
    { question: "Psycho-technique : Complétez : A1, B2, C3, D4, ...", options: ["E5", "E6", "F5", "D5"], answer: "E5" }
  ],
  4: [
    { question: "Maths : Résolvez l'équation : 2x - 4 = 10", options: ["x = 5", "x = 6", "x = 7", "x = 8"], answer: "x = 7" },
    { question: "Géométrie : Quelle est l'aire d'un rectangle de longueur 8 cm et largeur 5 cm ?", options: ["40 cm²", "26 cm²", "13 cm²", "30 cm²"], answer: "40 cm²" },
    { question: "Physique : Quelle est la formule de la vitesse moyenne ?", options: ["V = D x T", "V = D / T", "V = T / D", "V = D + T"], answer: "V = D / T" },
    { question: "Psycho-technique : Si 3 chats attrapent 3 souris en 3 minutes, combien de temps faut-il à 100 chats pour attraper 100 souris ?", options: ["100 minutes", "3 minutes", "30 minutes", "1 minute"], answer: "3 minutes" }
  ],
  5: [
    { question: "Maths : Que vaut 5 au carré (5²) multiplié par 2 ?", options: ["20", "25", "50", "100"], answer: "50" },
    { question: "Géométrie : Quel théorème s'applique aux triangles rectangles pour calculer l'hypoténuse ?", options: ["Théorème de Thalès", "Théorème de Pythagore", "Loi des sinus", "Théorème d'Al-Kashi"], answer: "Théorème de Pythagore" },
    { question: "Physique : Quelle est la première loi de Newton ?", options: ["Loi de la gravitation", "Principe d'inertie", "Action-Réaction", "Loi d'Ohm"], answer: "Principe d'inertie" },
    { question: "Psycho-technique : Complétez la suite logique : 1, 1, 2, 3, 5, 8, ...", options: ["11", "12", "13", "15"], answer: "13" }
  ],
  6: [
    { question: "Maths : Simplifiez la fraction : 24 / 36", options: ["1/2", "2/3", "3/4", "4/5"], answer: "2/3" },
    { question: "Géométrie : Combien d'intersections parallèles possède un trapèze ?", options: ["Aucune", "1 paire de côtés parallèles", "2 paires de côtés parallèles", "3 côtés parallèles"], answer: "1 paire de côtés parallèles" },
    { question: "Physique : Quelle est l'unité de mesure de la résistance électrique ?", options: ["Volt", "Ampère", "Ohm", "Watt"], answer: "Ohm" },
    { question: "Psycho-technique : Anagramme : Quel mot réorganisé forme le mot 'CHIEN' ?", options: ["NICHE", "CHINE", "CHINE/NICHE", "AUCUN"], answer: "CHINE/NICHE" }
  ],
  7: [
    { question: "Maths : Quelle est la racine carrée de 144 ?", options: ["10", "11", "12", "14"], answer: "12" },
    { question: "Géométrie : Quelle est la formule du volume d'un cube de côté 'a' ?", options: ["a²", "6a", "a³", "4a³"], answer: "a³" },
    { question: "Physique : Que vaut l'accélération de la pesanteur terrestre (g) approximativement ?", options: ["8.5 m/s²", "9.81 m/s²", "10.5 m/s²", "12.0 m/s²"], answer: "9.81 m/s²" },
    { question: "Psycho-technique : Complétez : 3, 9, 27, 81, ...", options: ["162", "243", "324", "100"], answer: "243" }
  ],
  8: [
    { question: "Maths : Développez l'expression : (x + 3)²", options: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9", "2x + 6"], answer: "x² + 6x + 9" },
    { question: "Géométrie : Quelle est la valeur approximative de Pi (π) ?", options: ["3.12", "3.14", "3.16", "3.18"], answer: "3.14" },
    { question: "Physique : Quelle relation exprime la loi d'Ohm ?", options: ["U = R / I", "U = R x I", "P = U x I", "I = U x R"], answer: "U = R x I" },
    { question: "Psycho-technique : Si aujourd'hui est mardi, quel jour serons-nous dans 100 jours ?", options: ["Jeudi", "Vendredi", "Samedi", "Dimanche"], answer: "Jeudi" }
  ],
  9: [
    { question: "Maths : Résolvez le système : x + y = 10 et x - y = 2", options: ["x=6, y=4", "x=5, y=5", "x=7, y=3", "x=8, y=2"], answer: "x=6, y=4" },
    { question: "Géométrie : Quelle est la somme des angles d'un quadrilatère ?", options: ["180°", "270°", "360°", "540°"], answer: "360°" },
    { question: "Physique : Quelle est la relation équivalence masse-énergie d'Einstein ?", options: ["E = mc", "E = m/c²", "E = mc²", "E = 1/2 mv²"], answer: "E = mc²" },
    { question: "Psycho-technique : Complétez la suite : 100, 95, 85, 70, 50, ...", options: ["25", "30", "35", "20"], answer: "25" }
  ],
  10: [
    { question: "Maths : Quelle est la dérivée de la fonction f(x) = x³ ?", options: ["3x", "3x²", "x²", "x³/3"], answer: "3x²" },
    { question: "Géométrie : Comment appelle-t-on un polyèdre régulier à 12 faces ?", options: ["Icosaèdre", "Dodécaèdre", "Octaèdre", "Tétraèdre"], answer: "Dodécaèdre" },
    { question: "Physique : Quel principe stipule qu'on ne peut pas connaître simultanément la position et la vitesse d'une particule ?", options: ["Principe de Pauli", "Principe d'incertitude d'Heisenberg", "Effet Photoélectrique", "Loi de Kepler"], answer: "Principe d'incertitude d'Heisenberg" },
    { question: "Psycho-technique : Complétez la suite complexe : 2, 3, 5, 7, 11, 13, 17, ...", options: ["18", "19", "21", "23"], answer: "19" }
  ]
};

// 2. BASE DE DONNÉES PAR CATÉGORIES
const questionsData = {
  histoire: [
    { question: "En quelle année est arrivée l'indépendance de la RDC ?", options: ["1960", "1958", "1965", "1970"], answer: "1960" },
    { question: "Qui fut le premier Président de la RDC ?", options: ["Joseph Kasa-Vubu", "Patrice Lumumba", "Mobutu Sese Seko", "Laurent-Désiré Kabila"], answer: "Joseph Kasa-Vubu" },
    { question: "En quelle année s'est terminée la Seconde Guerre mondiale ?", options: ["1918", "1939", "1945", "1950"], answer: "1945" },
    { question: "Qui était le premier empereur de Rome ?", options: ["Jules César", "Auguste", "Néron", "Marc Aurèle"], answer: "Auguste" },
    { question: "Quel grand empire antique a construit les pyramides de Gizeh ?", options: ["Empire Romain", "Empire Grec", "Égypte antique", "Empire Babylonien"], answer: "Égypte antique" },
    { question: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?", options: ["1965", "1969", "1972", "1975"], answer: "1969" },
    { question: "Qui a écrit la Déclaration d'Indépendance américaine en 1776 ?", options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "Abraham Lincoln"], answer: "Thomas Jefferson" }
  ],
  sciences: [
    { question: "Quel est le symbole chimique de l'eau ?", options: ["CO2", "H2O", "O2", "NaCl"], answer: "H2O" },
    { question: "Quelle planète est surnommée la 'Planète Rouge' ?", options: ["Jupiter", "Mars", "Vénus", "Saturne"], answer: "Mars" },
    { question: "Quel est l'organe principal du système circulatoire humain ?", options: ["Le poumon", "Le cerveau", "Le cœur", "Le foie"], answer: "Le cœur" },
    { question: "Quelle est la vitesse de la lumière dans le vide ?", options: ["300 000 km/s", "150 000 km/s", "1 000 000 km/s", "30 000 km/s"], answer: "300 000 km/s" },
    { question: "Quel gaz les plantes absorbent-elles lors de la photosynthèse ?", options: ["Oxygène", "Azote", "Dioxyde de carbone (CO2)", "Hydrogène"], answer: "Dioxyde de carbone (CO2)" },
    { question: "Qui a développé la théorie de la relativité générale ?", options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galilée"], answer: "Albert Einstein" },
    { question: "Quel est l'élément chimique le plus abondant dans l'univers ?", options: ["Oxygène", "Carbone", "Hydrogène", "Hélium"], answer: "Hydrogène" }
  ],
  technologie: [
    { question: "Que signifie l'acronyme HTML ?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Main Logic", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
    { question: "Quel langage est principalement utilisé pour styliser les pages web ?", options: ["Python", "HTML", "CSS", "C++"], answer: "CSS" },
    { question: "Qui a cofondé l'entreprise Microsoft ?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], answer: "Bill Gates" },
    { question: "Que signifie l'acronyme CPU dans un ordinateur ?", options: ["Central Processing Unit", "Computer Personal Unit", "Control Power Utility", "Central Performance User"], answer: "Central Processing Unit" },
    { question: "Quel système d'exploitation mobile a été développé par Google ?", options: ["iOS", "Android", "Windows Phone", "Symbian"], answer: "Android" },
    { question: "Lequel de ces langages est particulièrement réputé en analyse de données et IA ?", options: ["PHP", "Python", "Assembly", "Pascal"], answer: "Python" },
    { question: "Que signifie l'acronyme HTTP ?", options: ["HyperText Transfer Protocol", "High Transfer Text Program", "Hyper Technical Text Process", "Home Tool Transfer Protocol"], answer: "HyperText Transfer Protocol" }
  ],
  geographie: [
    { question: "Quelle est la capitale de la RDC ?", options: ["Lubumbashi", "Goma", "Kinshasa", "Kisangani"], answer: "Kinshasa" },
    { question: "Quel est le plus grand océan de la Terre ?", options: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"], answer: "Océan Pacifique" },
    { question: "Dans quel continent se trouve le désert du Sahara ?", options: ["Asie", "Afrique", "Amérique du Sud", "Australie"], answer: "Afrique" },
    { question: "Quel est le plus long fleuve du monde ?", options: ["Le Nil", "L'Amazone", "Le Fleuve Congo", "Le Mississippi"], answer: "L'Amazone" },
    { question: "Quelle est la capitale du Japon ?", options: ["Pékin", "Séoul", "Tokyo", "Bangkok"], answer: "Tokyo" },
    { question: "Quel pays possède la plus grande population au monde ?", options: ["États-Unis", "Inde", "Chine", "Brésil"], answer: "Inde" }
  ],
  culture: [
    { question: "Qui a peint la célèbre Joconde (Mona Lisa) ?", options: ["Vincent van Gogh", "Léonard de Vinci", "Pablo Picasso", "Claude Monet"], answer: "Léonard de Vinci" },
    { question: "Quel est l'instrument à cordes pincées comportant généralement 6 cordes ?", options: ["Violon", "Piano", "Guitare", "Flûte"], answer: "Guitare" },
    { question: "Combien de couleurs composent un arc-en-ciel traditionnel ?", options: ["5", "6", "7", "8"], answer: "7" },
    { question: "Qui a écrit la pièce 'Roméo et Juliette' ?", options: ["Victor Hugo", "William Shakespeare", "Molière", "Dante"], answer: "William Shakespeare" },
    { question: "Quelle langue est la plus parlée au monde en nombre de locuteurs natifs ?", options: ["Anglais", "Espagnol", "Mandarin", "Hindi"], answer: "Mandarin" }
  ],
  sport: [
    { question: "Tous les combien d'années ont lieu les Jeux Olympiques d'été ?", options: ["2 ans", "3 ans", "4 ans", "5 ans"], answer: "4 ans" },
    { question: "Combien de joueurs composent une équipe de football sur le terrain ?", options: ["9", "10", "11", "12"], answer: "11" },
    { question: "Dans quel sport utilise-t-on les termes 'Strike' et 'Spare' ?", options: ["Bowling", "Tennis", "Golf", "Baseball"], answer: "Bowling" },
    { question: "Quel pays a remporté la Coupe du Monde de football FIFA en 2022 ?", options: ["France", "Brésil", "Argentine", "Allemagne"], answer: "Argentine" },
    { question: "Quelle distance parcourt-on dans un marathon classique ?", options: ["21,1 km", "42,195 km", "50 km", "10 km"], answer: "42,195 km" }
  ]
};

// VARIABLES D'ÉTAT
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let currentModeTitle = "";
let currentStorageKey = "";
let lastGameType = "";
let lastTarget = "";

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
  const q = currentQuestions[currentQuestionIndex];

  document.getElementById("mode-indicator").innerText = currentModeTitle;
  document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} / ${currentQuestions.length}`;
  document.getElementById("score-display").innerText = `Score : ${score}`;
  document.getElementById("question-text").innerText = q.question;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  const shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.innerText = option;
    
    // Support hybride Clic & Tactile Mobile
    let isClicked = false;
    const handleSelect = (e) => {
      if (isClicked) return;
      isClicked = true;
      e.preventDefault();
      checkAnswer(option, q.answer);
    };

    btn.addEventListener("touchend", handleSelect, { passive: false });
    btn.addEventListener("click", handleSelect);

    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";

  const totalQuestions = currentQuestions.length;
  const successThreshold = Math.ceil(totalQuestions / 2);

  const resultTitleElem = document.getElementById("result-title");
  const finalScoreElem = document.getElementById("final-score");
  const encouragementMsgElem = document.getElementById("encouragement-msg");

  finalScoreElem.innerText = `${currentModeTitle} terminé ! Votre score : ${score} / ${totalQuestions}`;

  if (score < successThreshold) {
    resultTitleElem.innerText = "❌ Tu as échoué !";
    resultTitleElem.style.color = "#e74c3c";
    encouragementMsgElem.innerText = "Ne te décourage pas ! C'est en faisant des erreurs qu'on apprend. Relève le défi, réessaie pour t'améliorer ou choisis un autre niveau ! 💪";
  } else {
    resultTitleElem.innerText = "🎉 Félicitations, c'est gagné !";
    resultTitleElem.style.color = "#27ae60";
    encouragementMsgElem.innerText = "Super travail ! Tu maîtrises bien ce niveau. Continue sur cette lancée ! 🚀";
  }

  const bestScore = localStorage.getItem(currentStorageKey) || 0;

  if (score > bestScore) {
    localStorage.setItem(currentStorageKey, score);
    document.getElementById("high-score").innerText = `🏆 Nouveau record personnel : ${score} pts !`;
  } else {
    document.getElementById("high-score").innerText = `Meilleur score enregistré : ${bestScore} pts`;
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
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "none";
  document.getElementById("selection-screen").style.display = "block";
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}