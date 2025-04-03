document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");
    const startQuizButton = document.getElementById("start-quiz");
    const answersContainer = document.getElementById("answers-container");
    const questionText = document.getElementById("question-text");
    const finalScore = document.getElementById("final-score");
    const timerElement = document.getElementById("timer");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;

    // Function to show a screen
    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    // Fetch Questions from API
    async function fetchQuestions() {
        const apiUrl = "https://opentdb.com/api.php?amount=10&category=15&type=multiple";
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results;
            startQuiz();
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    }

    // Start Quiz
    function startQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        showScreen(quizScreen);
        loadQuestion();
    }

    // Load Question
    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        clearInterval(timer);
        let question = questions[currentQuestionIndex];
        questionText.innerHTML = decodeHTML(question.question);
        answersContainer.innerHTML = "";

        let answers = [...question.incorrect_answers, question.correct_answer];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            let button = document.createElement("button");
            button.innerHTML = decodeHTML(answer);
            button.classList.add("answer-btn");
            button.addEventListener("click", () => checkAnswer(button, answer, question.correct_answer));
            answersContainer.appendChild(button);
        });

        startTimer();
    }

    // Start Timer
    function startTimer() {
        let timeLeft = 15;
        timerElement.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                currentQuestionIndex++;
                loadQuestion();
            }
        }, 1000);
    }

    // Check Answer
    function checkAnswer(button, selectedAnswer, correctAnswer) {
        clearInterval(timer);
        if (selectedAnswer === correctAnswer) {
            score++;
            button.style.backgroundColor = "green";
        } else {
            button.style.backgroundColor = "red";
        }
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1000);
    }

    // Show Results
    function showResults() {
        finalScore.textContent = `${score}/10`;
        showScreen(resultsScreen);
    }

    // Decode HTML Entities
    function decodeHTML(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Start Quiz Button
    startQuizButton.addEventListener("click", () => {
        fetchQuestions();
    });

    // Initially show the welcome screen
    showScreen(welcomeScreen);
});
