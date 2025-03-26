const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

if (highScores.length === 0) {
    highScoresList.innerHTML = "<p class='no-scores'>No high scores yet!</p>";
} else {
    highScoresList.innerHTML = highScores
        .slice(0, 5) // Chỉ lấy tối đa 5 người top đầu
        .map((score, index) => {
            let rankText = index < 3 ? `Top ${index + 1}` : index + 1;
            let className = index === 0 ? "top1" : "high-score"; // Tô đỏ Top 1
            return `<li class="${className}">${rankText} - ${score.name}: ${score.score}</li>`;
        })
        .join("");
}
