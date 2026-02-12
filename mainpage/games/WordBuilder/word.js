import { questionBank } from "./questions.js";

const TOTAL_QUESTIONS = 10;
const BASE_URL = "https://brightminds-backend-3.onrender.com";

let gameIndex = 0;
let skillLevel = 1;
let correctStreak = 0;
let wrongStreak = 0;
let currentQuestion = null;

const sentenceEl = document.getElementById("sentence");
const optionsEl = document.getElementById("options");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const popup = document.getElementById("popup");
const skillText = document.getElementById("skill-level");
const topicName = document.getElementById("topic-name");
const topicTip = document.getElementById("topic-tip");

const bgSound = new Audio("assets/bg1.mp3");
const correctSound = new Audio("assets/c1.mp3");
const wrongSound = new Audio("assets/w1.mp3");

bgSound.loop = true;
bgSound.volume = 0.25;

document.addEventListener("pointerdown", () => {
  if (bgSound.paused) bgSound.play().catch(() => {});
}, { once: true });


function saveGameScore(gameName, score) {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  fetch(`${BASE_URL}/api/game/saveScore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      gameName: gameName,
      score: score
    })
  }).catch(err => console.error("Score save failed", err));
}


function getQuestion() {
  const pool =
    skillLevel === 1 ? questionBank.easy :
    skillLevel === 2 ? questionBank.medium :
    questionBank.hard;

  return pool[Math.floor(Math.random() * pool.length)];
}
function loadQuestion() {
  if (gameIndex >= TOTAL_QUESTIONS) {
    bgSound.pause();
    saveGameScore("WordBuilder", 10)
    popup.style.display = "flex";
    return;
  }

  currentQuestion = getQuestion();

  sentenceEl.innerText = currentQuestion.sentence;
  topicName.innerText = currentQuestion.topic;
  topicTip.innerHTML = getTip(currentQuestion.topic);

  optionsEl.innerHTML = "";

  currentQuestion.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => handleAnswer(opt, btn);
    optionsEl.appendChild(btn);
  });

  updateProgress();
}

function handleAnswer(selected, btn) {
  const buttons = document.querySelectorAll(".options button");

  if (selected === currentQuestion.answer) {
    buttons.forEach(b => b.disabled = true);

    correctSound.currentTime = 0;
    correctSound.play();
    btn.classList.add("correct");

    correctStreak++;
    wrongStreak = 0;

    adjustDifficulty();

    setTimeout(() => {
      gameIndex++;
      loadQuestion();
    }, 700);

  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
    btn.classList.add("wrong");

    wrongStreak++;
    correctStreak = 0;

    adjustDifficulty();

    setTimeout(() => {
      btn.classList.remove("wrong");
    }, 400);
  }
}

function adjustDifficulty() {
  if (correctStreak >= 3 && skillLevel < 3) {
    skillLevel++;
    correctStreak = 0;
  }

  if (wrongStreak >= 2 && skillLevel > 1) {
    skillLevel--;
    wrongStreak = 0;
  }

  skillText.innerText =
    skillLevel === 1 ? "Easy" :
    skillLevel === 2 ? "Medium" : "Hard";
}

function updateProgress() {
  progressText.innerText = `${gameIndex + 1} / ${TOTAL_QUESTIONS}`;
  progressFill.style.width =
    `${((gameIndex + 1) / TOTAL_QUESTIONS) * 100}%`;
}

function getTip(topic) {
  const tips = {
    "Articles": `
      <b>Rule:</b> Articles come before nouns.<br><br>
      ➤ Use <b>a</b> before consonant sounds<br>
      ➤ Use <b>an</b> before vowel sounds<br>
      ➤ Use <b>the</b> for specific things<br><br>
      <b>Examples:</b><br>
      ✔ a cat<br>
      ✔ an apple<br>
      ✔ the sun
    `,

    "Adjectives": `
      <b>Rule:</b> Adjectives describe nouns.<br><br>
      ➤ They tell size, color, shape, or quality<br>
      ➤ They come <b>before</b> nouns<br><br>
      <b>Examples:</b><br>
      ✔ a <b>big</b> house<br>
      ✔ a <b>red</b> ball
    `,

    "Verbs": `
      <b>Rule:</b> Verbs show action or state.<br><br>
      ➤ Every sentence needs a verb<br>
      ➤ Verbs can change with tense<br><br>
      <b>Examples:</b><br>
      ✔ She <b>runs</b><br>
      ✔ They <b>are</b> happy
    `,

    "Adverbs": `
      <b>Rule:</b> Adverbs describe verbs.<br><br>
      ➤ Many adverbs end with <b>-ly</b><br>
      ➤ They show how, when, or how often<br><br>
      <b>Examples:</b><br>
      ✔ runs <b>quickly</b><br>
      ✔ speaks <b>softly</b>
    `,

    "Pronouns": `
      <b>Rule:</b> Pronouns replace nouns.<br><br>
      ➤ Avoid repeating names<br>
      ➤ Match gender and number<br><br>
      <b>Examples:</b><br>
      ✔ Riya → <b>she</b><br>
      ✔ The boys → <b>they</b>
    `,
    "Modal Verbs": `
  <b>Rule:</b> Modal verbs show ability, permission, advice, or possibility.<br><br>
  ➤ Modals do <b>not</b> change with the subject<br>
  ➤ The main verb stays in <b>base form</b><br><br>
  <b>Examples:</b><br>
  ✔ She <b>can</b> swim<br>
  ✔ You <b>should</b> study<br>
  ✔ He <b>must</b> wear a helmet
`,
"Negatives": `
  <b>Rule:</b> Negative sentences say something is <b>not</b> true.<br><br>
  ➤ Use <b>not</b> with helping verbs<br>
  ➤ Use <b>do / does / did + not</b> with action verbs<br><br>
  <b>Examples:</b><br>
  ✔ She <b>does not</b> like milk<br>
  ✔ He <b>is not</b> late
`,
"Singular/Plural": `
  <b>Rule:</b> Singular means <b>one</b>, plural means <b>more than one</b>.<br><br>
  ➤ Add <b>-s</b> or <b>-es</b> to make plurals<br>
  ➤ Some words change form<br><br>
  <b>Examples:</b><br>
  ✔ one box → two <b>boxes</b><br>
  ✔ one child → two <b>children</b>
`,
"Comparatives": `
  <b>Rule:</b> Comparatives are used to compare <b>two things</b>.<br><br>
  ➤ Add <b>-er</b> to short adjectives<br>
  ➤ Use <b>more</b> with long adjectives<br><br>
  <b>Examples:</b><br>
  ✔ a cat is <b>faster</b> than a dog<br>
  ✔ this box is <b>bigger</b><br>
  ✔ math is <b>more difficult</b> than art
`

  };

  return tips[topic] || "Choose the correct word carefully.";
}

window.restartGame = function () {
  popup.style.display = "none";
  gameIndex = 0;
  skillLevel = 1;
  correctStreak = 0;
  wrongStreak = 0;
  bgSound.currentTime = 0;
  bgSound.play().catch(() => {});
  loadQuestion();
};

window.goBack = function () {
  window.location.href = "index.html";
};

loadQuestion();
