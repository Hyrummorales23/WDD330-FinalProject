// questionManager.js
export class QuestionManager {
    constructor() {
        this.questions = [];
        this.localPath = "./data/pokemon-questions.json";
    }

    async loadQuestions(difficulty) {
        const response = await fetch(this.localPath);
        if (!response.ok) throw new Error("Failed to load questions");
        const data = await response.json();
        this.questions = data
            .filter(q => q.difficulty?.toLowerCase() === difficulty)
            .sort(() => Math.random() - 0.5)
            .slice(0, 15);
    }
}