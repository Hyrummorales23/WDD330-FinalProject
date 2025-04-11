const STORAGE_KEY = "pokemon_trainer_leaderboard";
const MAX_SCORES = 5;

export function getLeaderboard() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveScore(scoreObj) {
    const leaderboard = getLeaderboard();
    leaderboard.push(scoreObj);
    leaderboard.sort((a, b) => b.score - a.score); // Descending
    const topFive = leaderboard.slice(0, MAX_SCORES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topFive));
}

export function clearLeaderboard() {
    localStorage.removeItem(STORAGE_KEY);
}