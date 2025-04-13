// quiz.js
import { QuestionManager } from "./questionManager.js";
import { UIManager } from "./uiManager.js";
import { saveScore, getLeaderboard } from "./storage.js";

export class Quiz {
    constructor() {
        this.questionManager = new QuestionManager();
        this.ui = new UIManager();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
    }

    init() {
        this.ui.startButton.addEventListener("click", () => {
            this.fetchQuestions();
        });

        this.ui.restartButton.addEventListener("click", () => {
            this.ui.resetUI();
            this.fetchQuestions();
        });

        this.ui.showScreen(this.ui.welcomeScreen);
    }

    async fetchQuestions() {
        this.ui.showLoading(true);
        const difficulty = this.ui.getSelectedDifficulty();

        try {
            await this.questionManager.loadQuestions(difficulty);
            this.score = 0;
            this.currentQuestionIndex = 0;
            this.ui.showScreen(this.ui.quizScreen);
            this.loadQuestion();
        } catch (err) {
            console.error("Failed to fetch questions:", err);
        } finally {
            this.ui.showLoading(false);
        }
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.questionManager.questions.length) {
            this.showResults();
            return;
        }

        clearInterval(this.timer);

        const question = this.questionManager.questions[this.currentQuestionIndex];
        this.ui.displayQuestion(question, (selected, correct, button) => {
            clearInterval(this.timer);
            if (selected === correct) {
                this.score++;
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
            }

            setTimeout(() => {
                this.currentQuestionIndex++;
                this.loadQuestion();
            }, 1000);
        });

        this.startTimer();
    }

    startTimer() {
        let timeLeft = 15;
        this.ui.updateTimer(timeLeft);
        this.timer = setInterval(() => {
            timeLeft--;
            this.ui.updateTimer(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.currentQuestionIndex++;
                this.loadQuestion();
            }
        }, 1000);
    }

    showResults() {
        this.ui.displayScore(`${this.score}/15`);
        this.ui.showScreen(this.ui.resultsScreen);

        const userName = prompt("Enter your name for the leaderboard:") || "Anonymous";
        saveScore({ name: userName, score: this.score, timestamp: new Date().toISOString() });
        this.ui.renderLeaderboard(getLeaderboard());
        this.ui.displayRandomTrivia();
    }
}