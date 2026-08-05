// Base de données de questions directement en JavaScript
const questionsData = {
  histoire: [
    { question: "En quelle année est arrivée l'indépendance de la RDC ?", options: ["1960", "1958", "1965", "1970"], answer: "1960" },
    { question: "Qui fut le premier Président de la RDC ?", options: ["Joseph Kasa-Vubu", "Patrice Lumumba", "Mobutu Sese Seko", "Laurent-Désiré Kabila"], answer: "Joseph Kasa-Vubu" },
    { question: "Quelle grande guerre s'est terminée en 1945 ?", options: ["Première Guerre mondiale", "Guerre de Cent Ans", "Seconde Guerre mondiale", "Guerre Froide"], answer: "Seconde Guerre mondiale" }
  ],
  sciences: [
    { question: "Quel est le symbole chimique de l'eau ?", options: ["CO2", "H2O", "O2", "NaCl"], answer: "H2O" },
    { question: "Quelle planète est surnommée la planète rouge ?", options: ["Jupiter", "Mars", "Vénus", "Saturne"], answer: "Mars" },
    { question: "Quel est l'organe principal du système circulatoire ?", options: ["Le poumon", "Le cerveau", "Le cœur", "Le foie"], answer: "Le cœur" }
  ],
  technologie: [
    { question: "Que signifie HTML ?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Main Logic", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
    { question: "Quel langage est principalement utilisé pour le style web ?", options: ["Python", "HTML", "CSS", "C++"], answer: "CSS" },
    { question: "Qui a fondé Microsoft ?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], answer: "Bill Gates" }
  ]
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

function startQuiz(category) {
  // Mélanger et sélectionner 3 questions au hasard
  const allQuestions = [...questionsData[category]];
  currentQuestions = shuffleArray(allQuestions).slice(0, 3);
  
  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("category-selection").style.display = "none";
  document.getElementById("quiz-box").style.display = "block";
  document.getElementById("result-box").style.display = "none";

  showQuestion();
}

function showQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  document.getElementById("question-text").innerText = `Question ${currentQuestionIndex + 1}: ${q.question}`;
  
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, q.answer);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("score-display").innerText = `Score actuel : ${score}`;
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
  document.getElementById("final-score").innerText = `Votre score final est : ${score} / ${currentQuestions.length}`;

  // Sauvegarde du meilleur score dans le navigateur (localStorage)
  const bestScore = localStorage.getItem("bestScore") || 0;
  if (score > bestScore) {
    localStorage.setItem("bestScore", score);
    document.getElementById("high-score").innerText = `Nouveau record personnel ! 🎉 (${score})`;
  } else {
    document.getElementById("high-score").innerText = `Meilleur score enregistré : ${bestScore}`;
  }
}

function resetQuiz() {
  document.getElementById("result-box").style.display = "none";
  document.getElementById("category-selection").style.display = "block";
}

// Fonction utilitaire pour mélanger un tableau
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}