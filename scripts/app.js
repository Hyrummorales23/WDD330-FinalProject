document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");

    const startQuizButton = document.getElementById("start-quiz");
    const restartQuizButton = document.getElementById("restart-quiz");

    // Function to show a screen
    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
        screen.classList.remove("hidden");
    }

    // Start Quiz Button
    startQuizButton.addEventListener("click", () => {
        showScreen(quizScreen);
    });

    // Restart Quiz Button
    restartQuizButton.addEventListener("click", () => {
        showScreen(welcomeScreen);
    });

    // Initially show the welcome screen
    showScreen(welcomeScreen);
});