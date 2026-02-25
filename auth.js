const auth = firebase.auth();
firebase.auth().useDeviceLanguage();
const loginTab = document.getElementById("loginTab");
const guestTab = document.getElementById("guestTab");
const loginSection = document.getElementById("loginSection");
const guestSection = document.getElementById("guestSection");
const BASE_URL = "https://brightminds-backend-3.onrender.com";

/* ---------------- TAB SWITCHING ---------------- */

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  guestTab.classList.remove("active");
  loginSection.classList.remove("hidden");
  guestSection.classList.add("hidden");
});

guestTab.addEventListener("click", () => {
  guestTab.classList.add("active");
  loginTab.classList.remove("active");
  guestSection.classList.remove("hidden");
  loginSection.classList.add("hidden");
});

auth.getRedirectResult()
  .then((result) => {
    if (result.user) {
      console.log("Redirect success:", result.user.email);
    }
  })
  .catch((error) => {
    console.error("Redirect result error:", error);
    alert(error.message);
  });
/* ---------------- AUTH STATE LISTENER ---------------- */
auth.onAuthStateChanged(async (user) => {
  console.log("Auth state changed:", user);

  if (!user) return;

  localStorage.setItem("userEmail", user.email);

  let alertShown = false;

  // ⏳ Show alert if backend takes more than 4 seconds
  const delayTimer = setTimeout(() => {
    alertShown = true;
    alert("Server is waking up. Please wait, this may take a few seconds...");
  }, 3000); // change time if needed

  try {

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(
    `${BASE_URL}/api/game/profileStatus?email=${encodeURIComponent(user.email)}`,
    { signal: controller.signal }
  );

  clearTimeout(timeout);
  clearTimeout(delayTimer);

  if (!response.ok) {
    throw new Error("Backend error");
  }

  const data = await response.json();
  const profileCreated = data.profileCreated ?? data;

  if (profileCreated === true) {
    window.location.replace("mainpage/index.html");
  } else {
    window.location.replace("mainpage/Dashboard/avtar.html");
  }

} catch (error) {
  clearTimeout(delayTimer);
  console.error("Profile check failed:", error);
  alert("Server is taking too long. Please try again.");
}
});

/* ---------------- GUEST LOGIN ---------------- */

document.getElementById("startGuest")?.addEventListener("click", () => {
  window.location.href = "mainpage/guest.html";
});

/* ---------------- GOOGLE LOGIN ---------------- */

document.getElementById("googleBtn")?.addEventListener("click", function (e) {
  e.preventDefault(); // IMPORTANT if inside form

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  // 🔥 Direct call WITHOUT async/await
  firebase.auth().signInWithRedirect(provider);
});

/* ---------------- MANUAL LOGIN / REGISTER ---------------- */

document.getElementById("manualLoginBtn")?.addEventListener("click", async () => {

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  try {
    localStorage.setItem("loginMode", "manual");

    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    await auth.signInWithEmailAndPassword(email, password);

  } catch {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }
});
