// Tableau de questions et réponses du quiz
const questions = [
    {
        question: "Quelle méthode JavaScript est utilisée pour ajouter un nouvel élément HTML à une page web?",
        answers: ["append()", "addElement()", "appendChild()"],
        correctAnswer: "appendChild()"
    },
    // Plus de questions...
];

// Logique du quiz
const submitButton = document.querySelector('.submit-btn');
const backButton = document.querySelector('.back-btn');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result');
let score = 0;
let currentIndex = 0;
let userAnswers = [];

// Fonction pour créer le quiz
function createQuiz(questions) {
    // Obtenir la question actuelle
    function getCurrentQuestion() {
        return questions[currentIndex];
    }

    // Vérifier la réponse de l'utilisateur
    function checkAnswer(answer) {
        const currentQuestion = getCurrentQuestion();
        userAnswers[currentIndex] = {
            question: currentQuestion.question,
            selectedAnswer: answer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: currentQuestion.correctAnswer === answer
        };

        if (currentQuestion.correctAnswer === answer) {
            score++;
        }
        currentIndex++;
    }

    // Vérifier si le quiz est terminé
    function hasEnded() {
        return currentIndex === questions.length;
    }

    // Décrémenter l'index de la question
    function decrementIndex() {
        if (currentIndex > 0) {
            currentIndex--;
        }
    }

    return {
        getCurrentQuestion,
        checkAnswer,
        hasEnded,
        getScore: () => score,
        getTotalQuestions: () => questions.length,
        getUserAnswers: () => userAnswers,
        decrementIndex,
        getCurrentQuestionIndex: () => currentIndex
    };
}

const quiz = createQuiz(questions);

// Afficher la question actuelle
function displayQuestion() {
    const currentQuestion = quiz.getCurrentQuestion();
    const userAnswers = quiz.getUserAnswers();
    const previousAnswer = userAnswers[quiz.getCurrentQuestionIndex()]?.selectedAnswer || "";

    const answersHTML = currentQuestion.answers.map(answer => `
        <div>
            <input type="radio" name="answer" value="${answer}" ${answer === previousAnswer ? "checked" : ""}>
            <label>${answer}</label>
        </div>`
    ).join('');

    quizContainer.innerHTML = `
        <div class="question">Question ${quiz.getCurrentQuestionIndex() + 1}: ${currentQuestion.question}</div>
        <div class="answers">${answersHTML}</div>
    `;

    backButton.style.display = quiz.getCurrentQuestionIndex() > 0 ? 'inline-block' : 'none';
}

// Fonctionnalité du minuteur
let timeRemaining = 3600;
let countdown;

// Démarrer le minuteur
function startTimer() {
    const timerElement = document.getElementById('timer');

    countdown = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerElement.textContent = `Temps restant : ${minutes}m ${seconds}s`;

        if (timeRemaining <= 0) {
            clearInterval(countdown);
            alert("Temps écoulé !");
            showResult();
        } else {
            timeRemaining--;
        }
    }, 1000);
}

// Afficher les résultats
function showResult() {
    clearInterval(countdown);
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';

    const userAnswers = quiz.getUserAnswers();
    let resultHTML = `<span class="timer">Vous avez ${quiz.getScore()}/${quiz.getTotalQuestions()}.</span><br><br>`;

    userAnswers.forEach((answer, index) => {
        resultHTML += `
            <div>
                <span>Question ${index + 1}:</span> <span>${answer.question}</span><br>
                <span>Votre réponse:</span> ${answer.selectedAnswer}<br>
                <span class="bonrep">La bonne réponse était : ${answer.correctAnswer}</span><br>
                <span>${answer.isCorrect ? '<b class="correcte">Correct</b>' : '<b class="faux">Incorrect</b>'}</span>
            </div><br>
        `;
    });

    resultContainer.innerHTML = resultHTML;
    resultContainer.style.display = 'block';
}

startTimer();

// Soumettre le quiz
function submitQuiz() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (selectedOption) {
        const answer = selectedOption.value;
        quiz.checkAnswer(answer);

        if (quiz.hasEnded()) {
            showResult();
        } else {
            displayQuestion();
        }
    } else {
        alert("Veuillez sélectionner une réponse.");
    }
}

// Écouteurs d'événements pour les boutons de navigation
backButton.addEventListener('click', () => {
    if (quiz.getCurrentQuestionIndex() > 0) {
        quiz.decrementIndex();
        displayQuestion();
    }
});

submitButton.addEventListener('click', submitQuiz);
displayQuestion();
