// Lấy các phần tử HTML
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const timerText = document.getElementById("timer");

// Biến game
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timeLeft = 30; //bắt đầu từ 30 giây
let timerInterval;

let questions = []; // Mảng câu hỏi

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;
const TIME_PENALTY = 5; // Trừ 5 điểm nếu hết giờ
const WRONG_PENALTY = 5; // Trừ 5 điểm khi trả lời sai

// Lấy dữ liệu từ question.json
fetch("./questions.json")
    .then((res) => res.json())
    .then((loadedQuestions) => {
        questions = shuffleArray(loadedQuestions);
        availableQuestions = [...questions];
        startGame();
    })
    .catch((err) => console.error("Lỗi tải câu hỏi:", err));

// Bắt đầu trò chơi
const startGame = () => {
    questionCounter = 0;
    score = 0;
    game.classList.remove("hidden");
    loader.classList.add("hidden");
    getNewQuestion();
};

// Lấy câu hỏi mới
const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        endGame();
        return;
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    resetTimer();
};

// Xử lý sự kiện click vào đáp án
choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        clearInterval(timerInterval); // Dừng đếm ngược

        const selectedChoice = e.target;
        const selectedAnswer = parseInt(selectedChoice.dataset["number"]);
        const isCorrect = selectedAnswer === currentQuestion.answer;

        selectedChoice.parentElement.classList.add(isCorrect ? "correct" : "incorrect");
        incrementScore(isCorrect ? CORRECT_BONUS : -WRONG_PENALTY); // Trừ điểm nếu sai

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove("correct", "incorrect");
            getNewQuestion();
        }, 1000);
    });
});

// Cập nhật điểm
const incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

// Xáo trộn câu hỏi (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Bắt đầu đếm ngược thời gian liên tục
function resetTimer() {
    clearInterval(timer);

    timeLeft = currentQuestion.time || 30;
    const timerText = document.getElementById("timer");

    timerText.innerText = `⏳ ${timeLeft}s`;
    timerText.classList.remove("low-time", "time-up");

    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = `⏳ ${timeLeft}s`;

        if (timeLeft <= 10) {
            timerText.classList.add("low-time"); // Màu cam + nhấp nháy
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerText.classList.add("time-up"); // Đổi sang màu đỏ
            getNewQuestion(); // Hết giờ, tự chuyển câu tiếp theo
        }
    }, 1000);
}

// Lưu điểm cao
const saveHighScore = (score) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    const newScore = { name: username, score: score };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5); // Chỉ giữ lại 5 điểm cao nhất

    localStorage.setItem("highScores", JSON.stringify(highScores));
};

// Khi game kết thúc, gọi:
saveHighScore(score);

// Kết thúc game
const endGame = () => {
    clearInterval(timerInterval);
    saveHighScore();
    localStorage.setItem("mostRecentScore", score);
    window.location.assign("/end.html");
};
