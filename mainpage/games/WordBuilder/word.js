import { questionBank } from "./questions.js";
const progressFill = document.getElementById("progress-fill");

const TOTAL_QUESTIONS = 10;
const BASE_URL = "https://brightminds-backend-3.onrender.com";

let gameIndex = 0;
let skillLevel = 1;
let currentQuestion = null;
let score = 10; // Start with full marks

const sentenceEl = document.getElementById("sentence");
const optionsEl = document.getElementById("options");
const popup = document.getElementById("popup");
const skillText = document.getElementById("skill-level");
const topicName = document.getElementById("topic-name");
const topicTip = document.getElementById("topic-tip");

const scoreDisplay = document.getElementById("score-display");
const finalScore = document.getElementById("final-score");

const bgSound = new Audio("assets/bg1.mp3");
const correctSound = new Audio("assets/c1.mp3");
const wrongSound = new Audio("assets/w1.mp3");

bgSound.loop = true;
bgSound.volume = 0.25;

document.addEventListener(
  "pointerdown",
  () => {
    if (bgSound.paused) bgSound.play().catch(() => {});
  },
  { once: true }
);

function saveGameScore(gameName, score) {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  fetch(`${BASE_URL}/api/game/saveScore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      gameName: gameName,
      score: score,
    }),
  }).catch((err) => console.error("Score save failed", err));
}

function getQuestion() {
  const pool =
    skillLevel === 1
      ? questionBank.easy
      : skillLevel === 2
      ? questionBank.medium
      : questionBank.hard;

  return pool[Math.floor(Math.random() * pool.length)];
}

function loadQuestion() {
  if (gameIndex >= TOTAL_QUESTIONS) {
    bgSound.pause();
    finalScore.innerText = `Score: ${score}/10`;
    saveGameScore("WordBuilder", score);
    popup.style.display = "flex";
    return;
  }

  currentQuestion = getQuestion();

  sentenceEl.innerText = currentQuestion.sentence;
  topicName.innerText = currentQuestion.topic;
  topicTip.innerHTML = getTip(currentQuestion.topic);

  optionsEl.innerHTML = "";

  currentQuestion.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => handleAnswer(opt, btn);
    optionsEl.appendChild(btn);
  });

  updateScoreDisplay();
  updateProgress();

}

function updateProgress() {
  progressFill.style.width =
    `${(gameIndex / TOTAL_QUESTIONS) * 100}%`;
}


function handleAnswer(selected, btn) {
  const buttons = document.querySelectorAll(".options button");
  buttons.forEach((b) => (b.disabled = true));

  if (selected === currentQuestion.answer) {
    correctSound.currentTime = 0;
    correctSound.play();
    btn.classList.add("correct");
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
    btn.classList.add("wrong");

    score--; // deduct 1 mark
    if (score < 0) score = 0;

    updateScoreDisplay();
  }

  setTimeout(() => {
    gameIndex++;
    loadQuestion();
  }, 700);
}

function updateScoreDisplay() {
  scoreDisplay.innerText = `${score}/10`;
}

function getTip(topic) {
  const tips = {
    Articles: `
      <b>Rule:</b> Articles come before nouns.<br><br>
      ➤ Use <b>a</b> before consonant sounds<br>
      ➤ Use <b>an</b> before vowel sounds<br>
      ➤ Use <b>the</b> for specific things<br><br>
      ✔ a cat<br>
      ✔ an apple<br>
      ✔ the sun
    `,
    Adjectives: `
      <b>Rule:</b> Adjectives describe nouns.<br><br>
      ➤ They come before nouns<br><br>
      ✔ a <b>big</b> house<br>
      ✔ a <b>red</b> ball
    `,
    Verbs: `
      <b>Rule:</b> Verbs show action or state.<br><br>
      ✔ She <b>runs</b><br>
      ✔ They <b>are</b> happy
    `,
    Adverbs: `
      <b>Rule:</b> Adverbs describe verbs.<br><br>
      ✔ runs <b>quickly</b><br>
      ✔ speaks <b>softly</b>
    `,
    Pronouns: `
      <b>Rule:</b> Pronouns replace nouns.<br><br>
      ✔ Riya → <b>she</b><br>
      ✔ The boys → <b>they</b>
    `,
  };

  return tips[topic] || "Choose carefully.";
}

window.restartGame = function () {
  popup.style.display = "none";
  progressFill.style.width = "0%";
  gameIndex = 0;
  skillLevel = 1;
  score = 10;
  updateScoreDisplay();
  bgSound.currentTime = 0;
  bgSound.play().catch(() => {});
  loadQuestion();
};

window.goBack = function () {
  window.location.href = "index.html";
};

loadQuestion();
