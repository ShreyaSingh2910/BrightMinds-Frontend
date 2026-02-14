const BASE_URL = "https://brightminds-backend-3.onrender.com";
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



const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

bgMusic.volume = 0.3;
correctSound.volume = 1;
wrongSound.volume = 1;

let audioStarted = false;
window.addEventListener(
  "pointerdown",
  () => {
    if (audioStarted) return;
    audioStarted = true;
    bgMusic.play().catch(() => {});
  },
  { once: true }
);

let dragged = null;
const userAnswers = {};

const labels = document.querySelectorAll(".label");
const dropZones = document.querySelectorAll(".drop-zone");

/* ================= DESKTOP DRAG ================= */

labels.forEach(label => {
  label.addEventListener("dragstart", () => {
    dragged = label;
  });
});

dropZones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", () => {
    if (!dragged) return;
    handleDrop(dragged, zone);
    dragged = null;
  });
});


/* ================= MOBILE TOUCH DRAG ================= */

labels.forEach(label => {

  let offsetX = 0;
  let offsetY = 0;
  let droppedSuccessfully = false;

  label.addEventListener("touchstart", e => {

    const touch = e.touches[0];
    const rect = label.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    label.style.position = "fixed";
    label.style.left = rect.left + "px";
    label.style.top = rect.top + "px";
    label.style.zIndex = "1000";

    droppedSuccessfully = false;
  });

  label.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.touches[0];

    label.style.left = (touch.clientX - offsetX) + "px";
    label.style.top = (touch.clientY - offsetY) + "px";
  }, { passive: false });

  label.addEventListener("touchend", () => {

    const labelRect = label.getBoundingClientRect();

    dropZones.forEach(zone => {
      const zoneRect = zone.getBoundingClientRect();

      if (
        labelRect.left < zoneRect.right &&
        labelRect.right > zoneRect.left &&
        labelRect.top < zoneRect.bottom &&
        labelRect.bottom > zoneRect.top
      ) {
        handleDrop(label, zone);
        droppedSuccessfully = true;
      }
    });

    // snap back if not dropped
    if (!droppedSuccessfully) {
      label.style.position = "";
      label.style.left = "";
      label.style.top = "";
      label.style.zIndex = "";
    }

  });

});


/* ================= SHARED DROP LOGIC ================= */

function handleDrop(label, zone) {

  if (zone.dataset.locked === "true") return;

  const zoneId = zone.dataset.id;

  if (userAnswers[zoneId]) {
    const prev = document.querySelector(
      `.label[data-name="${userAnswers[zoneId]}"]`
    );
    if (prev) prev.style.visibility = "visible";
  }

  zone.textContent = label.textContent;
  userAnswers[zoneId] = label.dataset.name;

  label.style.visibility = "hidden";

  // reset mobile styles
  label.style.position = "";
  label.style.left = "";
  label.style.top = "";
  label.style.zIndex = "";
}


function checkAnswers() {
  let allCorrect = true;
  let hasWrong = false;

  document.querySelectorAll(".drop-zone").forEach(zone => {
    const zoneId = zone.dataset.id;
    const correct = zone.dataset.answer;
    const user = userAnswers[zoneId];

    zone.classList.remove("correct", "wrong");

    if (!user) {
      allCorrect = false;
      hasWrong = true;
      return;
    }

    if (user === correct) {
      zone.classList.add("correct");
      zone.dataset.locked = "true";
    } else {
      zone.classList.add("wrong");
      hasWrong = true;
      allCorrect = false;
    }
  });

  if (hasWrong) {
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});

    setTimeout(() => {
      resetWrongAnswers();
      shuffleOptions();
    }, 1000);
  }

  if (allCorrect) {
    playCorrectSoundForWhile();
    setTimeout(showCelebration, 700);
  }
}

function resetWrongAnswers() {
  document.querySelectorAll(".drop-zone.wrong").forEach(zone => {
    const zoneId = zone.dataset.id;
    const wrongPart = userAnswers[zoneId];

    zone.textContent = "";
    zone.classList.remove("wrong");

    delete userAnswers[zoneId];

    const option = document.querySelector(
      `.label[data-name="${wrongPart}"]`
    );
    if (option) option.style.visibility = "visible";
  });
}

function shuffleOptions() {
  const container = document.querySelector(".options");
  const options = Array.from(container.children);

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  options.forEach(opt => container.appendChild(opt));
}

function playCorrectSoundForWhile() {
  correctSound.currentTime = 0;
  correctSound.play().catch(() => {});

  setTimeout(() => {
    correctSound.pause();
    correctSound.currentTime = 0;
  }, 1500);
}

function showCelebration() {
  saveGameScore("ScienceSpotter-PartsOfPlants", 10);
  const celebration = document.getElementById("celebration");
  celebration.classList.remove("hidden");

  lottie.loadAnimation({
    container: document.getElementById("celebrateAnim"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration2.json"
  });
}

function goBack() {
  window.location.href = "topic.html";
}

function openLearn() {
  document.getElementById("learnPanel").classList.remove("hidden");
}

function closeLearn() {
  document.getElementById("learnPanel").classList.add("hidden");
}

