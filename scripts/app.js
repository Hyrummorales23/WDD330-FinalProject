import { saveScore, getLeaderboard } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");
    const startQuizButton = document.getElementById("start-quiz");
    const answersContainer = document.getElementById("answers-container");
    const questionText = document.getElementById("question-text");
    const finalScore = document.getElementById("final-score");
    const timerElement = document.getElementById("timer");
    const restartQuizButton = document.getElementById("restart-quiz");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;

    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    async function fetchQuestions() {
        const localPath = "./data/pokemon-questions.json"; // Corrected path
        const difficultySelect = document.getElementById("difficulty");
        const selectedDifficulty = difficultySelect ? difficultySelect.value.toLowerCase() : "easy";  // Default fallback

        console.log("Selected Difficulty:", selectedDifficulty);

        // Show loading spinner while fetching questions
        document.getElementById('loading-spinner').style.display = 'block';

        try {
            const response = await fetch(localPath);
            if (!response.ok) throw new Error("Failed to load questions");
            const data = await response.json();
            const filtered = data.filter(q => q.difficulty && q.difficulty.toLowerCase() === selectedDifficulty);
            questions = filtered.sort(() => Math.random() - 0.5).slice(0, 15); // Shuffle and limit to 15
            startQuiz();
        } catch (error) {
            console.error("Error loading local Pokémon questions:", error);
        } finally {
            // Hide loading spinner when done
            document.getElementById('loading-spinner').style.display = 'none';
        }
    }

    function startQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        showScreen(quizScreen);
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        clearInterval(timer);
        let question = questions[currentQuestionIndex];
        questionText.innerHTML = decodeHTML(question.question);

        // Reset all previous answer button styles
        const oldButtons = answersContainer.querySelectorAll("button");
        oldButtons.forEach(btn => btn.style.backgroundColor = "");

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

    function checkAnswer(button, selectedAnswer, correctAnswer) {
        clearInterval(timer);
        if (selectedAnswer === correctAnswer) {
            score++;
            button.classList.add("correct");
        } else {
            button.classList.add("incorrect");
        }
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1000);
    }

    function showResults() {
        finalScore.textContent = `${score}/15`;
        showScreen(resultsScreen);

        // 🏆 Save Score to Local Storage After Quiz Ends
        const userName = prompt("Enter your name for the leaderboard:") || "Anonymous";

        const scoreData = {
            name: userName,
            score: score,  // Actual quiz score
            timestamp: new Date().toISOString(),
        };

        saveScore(scoreData);
        renderLeaderboard(); // 👈 show updated list
        console.log("Updated Leaderboard:", getLeaderboard());
        getRandomPokemonTrivia(); // 👈 Fetch and display Pokémon trivia
    }

    function renderLeaderboard() {
        const leaderboardList = document.getElementById("leaderboard-list");
        leaderboardList.innerHTML = ""; // Clear previous list

        const scores = getLeaderboard();
        scores.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `${entry.name} - ${entry.score} Pts`;
            leaderboardList.appendChild(li);
        });
    }

    function decodeHTML(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    startQuizButton.addEventListener("click", () => {
        console.log("Fetching questions...");
        fetchQuestions();
    });

    showScreen(welcomeScreen);

    async function getRandomPokemonTrivia() {
        const maxPokemonId = 898; // Safe limit
        const randomId = Math.floor(Math.random() * maxPokemonId) + 1;
        const triviaContainer = document.getElementById("trivia-text");

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();

            const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const type = data.types.map(t => t.type.name).join(", ");
            const image = data.sprites.other["official-artwork"].front_default;

            triviaContainer.innerHTML = `
                <h3>${name}</h3>
                <img src="${image}" alt="${name}" style="width: 150px;" />
                <p>Type: ${type}</p>
                <p>Base XP: ${data.base_experience}</p>
            `;
        } catch (error) {
            console.error("Error fetching Pokémon trivia:", error);
            triviaContainer.textContent = "Trivia unavailable. Please try again.";
        }
    }
    restartQuizButton.addEventListener("click", () => {
        // Clear previous trivia content
        document.getElementById("trivia-text").innerHTML = "Pokémon trivia will appear here!";

        // Reset score display
        finalScore.textContent = "0";

        // Clear any remaining answer buttons (just in case)
        answersContainer.innerHTML = "";

        // Start over with new questions
        fetchQuestions();
    });
});