const link = document.querySelector('.link');
const fabars = document.querySelector('.fa-bars');
const btn = document.querySelector('button');

fabars.addEventListener('click', () => {
    link.classList.toggle("afficher");
    btn.classList.toggle("afficher");
    fabars.classList.toggle('fa-times');
});

const submitButton = document.querySelector('.submit-btn');

function createQuiz(questions) {
    let score = 0;
    let currentIndex = 0;
    let userAnswers = [];

    function getCurrentQuestion() {
        return questions[currentIndex];
    }

    function checkAnswer(answer) {
        const currentQuestion = getCurrentQuestion();
        userAnswers.push({
            question: currentQuestion.question,
            selectedAnswer: answer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: currentQuestion.correctAnswer === answer
        });

        if (currentQuestion.correctAnswer === answer) {
            score++;
        }
        currentIndex++;
    }

    function hasEnded() {
        return currentIndex === questions.length;
    }

    return {
        getCurrentQuestion,
        checkAnswer,
        hasEnded,
        getScore: () => score,
        getTotalQuestions: () => questions.length,
        getUserAnswers: () => userAnswers
    };
}

const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result');

const quiz = createQuiz(questions);

function displayQuestion() {
    const currentQuestion = quiz.getCurrentQuestion();
    const answersHTML = currentQuestion.answers.map(answer =>
        `<div>
            <input type="radio" name="answer" value="${answer}">
            <label>${answer}</label>
        </div>`
    ).join('');

    quizContainer.innerHTML = `
        <div class="question">${currentQuestion.question}</div>
        <div class="answers">${answersHTML}</div>
    `;
}

let timeRemaining = 1600;
let countdown;

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

function showResult() {
    clearInterval(countdown);
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';

    const userAnswers = quiz.getUserAnswers();
    let resultHTML = `<span class="timer">Vous avez ${quiz.getScore()}/${quiz.getTotalQuestions()} .</span><br><br>`;

    userAnswers.forEach((answer, index) => {
        resultHTML += `
            <div>
                <span>Question ${index + 1}:</span> <span>${answer.question}</span><br>
                <span>Votre réponse:</span> ${answer.selectedAnswer}<br>
                <span class="bonrep">la bonne réponse était : ${answer.correctAnswer}</span><br>
                <span>${answer.isCorrect ? '<b class="correcte">Correct</b>' : '<b class="faux">Incorrect</b>'}</span>
            </div><br>
        `;
    });

    resultContainer.innerHTML = resultHTML;
    resultContainer.style.display = 'block';
}

startTimer();

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

displayQuestion();
submitButton.addEventListener('click', submitQuiz);
