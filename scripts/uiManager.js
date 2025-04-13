// uiManager.js
export class UIManager {
    constructor() {
        this.welcomeScreen = document.getElementById("welcome-screen");
        this.quizScreen = document.getElementById("quiz-screen");
        this.resultsScreen = document.getElementById("results-screen");
        this.startButton = document.getElementById("start-quiz");
        this.restartButton = document.getElementById("restart-quiz");
        this.difficultySelect = document.getElementById("difficulty");
        this.questionText = document.getElementById("question-text");
        this.answersContainer = document.getElementById("answers-container");
        this.timerElement = document.getElementById("timer");
        this.finalScore = document.getElementById("final-score");
        this.leaderboardList = document.getElementById("leaderboard-list");
        this.loadingSpinner = document.getElementById("loading-spinner");
        this.triviaContainer = document.getElementById("trivia-text");
    }

    showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    showLoading(show) {
        this.loadingSpinner.style.display = show ? "block" : "none";
    }

    getSelectedDifficulty() {
        return this.difficultySelect?.value?.toLowerCase() || "easy";
    }

    displayQuestion(question, callback) {
        this.questionText.innerHTML = this.decodeHTML(question.question);
        this.answersContainer.innerHTML = "";

        const allAnswers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
        allAnswers.forEach(answer => {
            const button = document.createElement("button");
            button.classList.add("answer-btn");
            button.innerHTML = this.decodeHTML(answer);
            button.addEventListener("click", () => callback(answer, question.correct_answer, button));
            this.answersContainer.appendChild(button);
        });
    }

    updateTimer(seconds) {
        this.timerElement.textContent = seconds;
    }

    displayScore(text) {
        this.finalScore.textContent = text;
    }

    renderLeaderboard(scores) {
        this.leaderboardList.innerHTML = "";
        scores.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `${entry.name} - ${entry.score} Pts`;
            this.leaderboardList.appendChild(li);
        });
    }

    displayRandomTrivia() {
        const maxId = 898;
        const randomId = Math.floor(Math.random() * maxId) + 1;

        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(res => res.json())
            .then(data => {
                const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                const type = data.types.map(t => t.type.name).join(", ");
                const image = data.sprites.other["official-artwork"].front_default;

                this.triviaContainer.innerHTML = `
            <h3>${name}</h3>
            <img src="${image}" alt="${name}" style="width: 150px;" />
            <p>Type: ${type}</p>
            <p>Base XP: ${data.base_experience}</p>
          `;
            })
            .catch(err => {
                console.error("Error loading trivia:", err);
                this.triviaContainer.textContent = "Trivia unavailable. Please try again.";
            });
    }

    resetUI() {
        this.triviaContainer.innerHTML = "Pokémon trivia will appear here!";
        this.finalScore.textContent = "0";
        this.answersContainer.innerHTML = "";
    }

    decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
}