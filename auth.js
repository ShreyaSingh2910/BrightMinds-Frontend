const auth = firebase.auth();
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

/* ---------------- AUTH STATE LISTENER ---------------- */
 
auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  localStorage.setItem("userEmail", user.email);

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/game/profileStatus?email=${encodeURIComponent(user.email)}`
      );

      if (!response.ok) throw new Error("Server not ready");

      const profileCreated = await response.json();

      if (profileCreated) {
        window.location.replace("mainpage/index.html");
      } else {
        window.location.replace("mainpage/Dashboard/avtar.html");
      }

      return; // success → exit loop

    } catch (error) {
      attempts++;
      console.log("Retrying... Attempt:", attempts);

      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  alert("Server is waking up. Please wait and try again.");
});


/* ---------------- GUEST LOGIN ---------------- */

document.getElementById("startGuest")?.addEventListener("click", () => {
  window.location.href = "mainpage/guest.html";
});

/* ---------------- GOOGLE LOGIN ---------------- */

document.getElementById("googleBtn")?.addEventListener("click", async () => {
  try {
    localStorage.setItem("loginMode", "google");

    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);

  } catch (error) {
    console.error(error);
    alert("Google sign-in failed");
  }
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



