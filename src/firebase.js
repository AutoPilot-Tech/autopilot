// Import the functions you need from the SDKs you need
import firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyAFah7wL3-fzSF37WthR2fhsuPU-JWl4yE",
  authDomain: "autopilot-a6c9a.firebaseapp.com",
  projectId: "autopilot-a6c9a",
  storageBucket: "autopilot-a6c9a.appspot.com",
  messagingSenderId: "309253222901",
  appId: "1:309253222901:web:bd906754eb3f03e457f0bc",
  measurementId: "G-97LRL0H2X9"
});

// Initialize Firebase
var db = firebase.firestore();

// initialize auth
const auth = firebase.auth();

if (location.hostname === "localhost") {
  // db.useEmulator("localhost", 8080);
  // auth.useEmulator("http://localhost:9099/", {disableWarnings: true});
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = () => {
  auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      console.log(res.user);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

// initialize functions
var functions = firebase.functions();

export {firebase, db, signInWithGoogle, auth, functions};
