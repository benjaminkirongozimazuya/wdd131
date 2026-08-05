// Base de données enrichie de questions par catégorie
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

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
const QUESTIONS_PER_GAME = 5; // Nombre de questions par partie

function startQuiz(category) {
  const categoryQuestions = [...questionsData[category]];
  // Mélange les questions et prend 5 questions au hasard
  currentQuestions = shuffleArray(categoryQuestions).slice(0, QUESTIONS_PER_GAME);

  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("category-selection").style.display = "none";
  document.getElementById("quiz-box").style.display = "block";
  document.getElementById("result-box").style.display = "none";

  showQuestion();
}

function showQuestion() {
  const q = currentQuestions[currentQuestionIndex];

  document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} / ${currentQuestions.length}`;
  document.getElementById("score-display").innerText = `Score : ${score}`;
  document.getElementById("question-text").innerText = q.question;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  // Mélange les propositions de réponses
  const shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, q.answer);
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

  document.getElementById("final-score").innerText = `Votre score final est de : ${score} / ${currentQuestions.length}`;

  const bestScore = localStorage.getItem("quizBestScore") || 0;
  if (score > bestScore) {
    localStorage.setItem("quizBestScore", score);
    document.getElementById("high-score").innerText = `🏆 Nouveau record personnel : ${score} pts !`;
  } else {
    document.getElementById("high-score").innerText = `Meilleur score enregistré : ${bestScore} pts`;
  }
}

function resetQuiz() {
  document.getElementById("result-box").style.display = "none";
  document.getElementById("category-selection").style.display = "block";
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}