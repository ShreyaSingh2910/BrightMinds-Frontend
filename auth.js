const auth = firebase.auth();
const loginTab = document.getElementById("loginTab");
const guestTab = document.getElementById("guestTab");
const loginSection = document.getElementById("loginSection");
const guestSection = document.getElementById("guestSection");
const BASE_URL = "https://brightminds-backend-3.onrender.com";


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

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/game/profileStatus?email=${encodeURIComponent(user.email)}`
    );

    const profileCreated = await response.json();

    if (!profileCreated) {
      // If profile does not exist in backend
      window.location.replace("mainpage/Dashboard/avtar.html");
      return;
    }

    window.location.replace("mainpage/index.html");

  } catch (error) {
    console.error("Profile check failed", error);
    await auth.signOut(); // Force logout
    window.location.href = "index.html";
  }
});


document.getElementById("startGuest").addEventListener("click", () => {
  window.location.href="mainpage/guest.html";
});


document.getElementById("googleBtn")?.addEventListener("click", async () => {
  try {
    localStorage.setItem("loginMode", "google"); 
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch (error) {
    console.error(error);
    alert("Google sign-in failed");
  }
});

document.getElementById("manualLoginBtn")?.addEventListener("click", async () => {

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  try {
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




