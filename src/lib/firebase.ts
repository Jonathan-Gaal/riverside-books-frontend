import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// All of these are public, browser-shipped values -- a Firebase web config is NOT a
// secret (it just identifies the project; security lives in Auth settings + rules).
// They still live in .env so the same build can target different Firebase projects.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Warn (don't throw) if the project isn't configured yet. The public catalog/events
// pages must keep working without Firebase; only the auth flows need it, and those will
// surface a friendly "network/config" error when actually used. Throwing here would
// white-screen the whole SPA before anyone even reaches /login.
const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (missing.length > 0) {
  console.warn(
    `[firebase] Not configured -- missing env vars: ${missing.join(", ")}. ` +
      "Copy .env.example to .env.local and fill in your Firebase web config to enable login.",
  );
}

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
