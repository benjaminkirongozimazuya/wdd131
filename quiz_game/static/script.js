let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function startQuiz(category) {
    try {
        const response = await fetch(`/api/questions/${category}`);
        questions = await response.json();
        
        if (questions.length === 0) {
            alert("Aucune question disponible pour cette catégorie.");
            return;
        }

        currentQuestionIndex = 0;
        score = 0;
        
        switchScreen('category-selection', 'quiz-screen');
        showQuestion();
    } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
    }
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question-number').innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('question-text').innerText = currentQuestion.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.onclick = () => checkAnswer(option, currentQuestion.answer);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score += 10;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById('final-score').innerText = `Votre score final : ${score} points`;
    switchScreen('quiz-screen', 'result-screen');
}

function resetQuiz() {
    switchScreen('result-screen', 'category-selection');
}

function switchScreen(hideId, showId) {
    document.getElementById(hideId).classList.remove('active');
    document.getElementById(showId).classList.add('active');
}