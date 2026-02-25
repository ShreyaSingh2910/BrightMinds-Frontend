function startLevel(level) {
  if (level === 1) {
    window.location.href = "level1.html";
  }

  if (level === 2) {
    window.location.href = "level2.html";
  }

  if (level === 3) {
     window.location.href = "level3.html";
  }

}
function goBack() {
    window.history.back();
}

function goHome() {
    window.location.href = "../../index.html"; 
}

