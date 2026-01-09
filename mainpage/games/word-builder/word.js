let shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 8);
let currentIndex = 0;
let isLocked = false;

const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const counter = document.getElementById("counter");
const progressFill = document.getElementById("progress-fill");
const popup = document.getElementById("popup");

const correctSound = new Audio("assets/c1.mp3");
const wrongSound = new Audio("assets/w1.mp3");
const bgSound = new Audio("assets/bg1.mp3");

bgSound.loop = true;
bgSound.volume = 0.30;
wrongSound.volume=1;
correctSound.volume=1;

document.body.addEventListener(
  "click",
  () => {
    if (bgSound.paused) bgSound.play();
  },
  { once: true }
);

function loadQuestion() {
  if (currentIndex >= shuffled.length) {
    popup.style.display = "flex";
    bgSound.pause();
    return;
  }

  isLocked = false;

  const q = shuffled[currentIndex];
  questionText.textContent = q.question;
  counter.textContent = `${currentIndex + 1} / 8`;
  progressFill.style.width = `${((currentIndex + 1) / 8) * 100}%`;

  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;

    btn.onclick = () => checkAnswer(btn, opt, q.answer);

    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(button, selected, correct) {
  if (isLocked) return;

  if (selected === correct) {
    isLocked = true;

    button.style.background = "#51cf66";
    button.style.boxShadow = "0 6px 0 #2f9e44";

    correctSound.currentTime = 0;
    correctSound.play();

    setTimeout(() => {
      currentIndex++;
      loadQuestion();
    }, 700);

  } else {
 
    button.style.background = "#ff6b6b";
    button.style.boxShadow = "0 6px 0 #c92a2a";

    wrongSound.currentTime = 0;
    wrongSound.play();

    button.disabled = true;

  }
}

function restartGame() {
  location.reload();
}

function goHome() {
  window.location.href = "index.html";
}

loadQuestion();

function goHome() {
  window.location.href = "index.html";
}
