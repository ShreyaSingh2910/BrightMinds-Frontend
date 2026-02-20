lottie.loadAnimation({
  container: document.getElementById("lottie-bg"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "lottie/back.json"
});

document.getElementById("startBtn").addEventListener("click", () => {
  window.location.href = "topic.html";
});

function goHome() {
    window.location.href = "../../index.html"; 
}






