// Import the functions you need from the SDKs you need
import firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyByQ9uymQz0xR06INhjGTIQPFlYAaE-Rgg",
  authDomain: "autopilot-7ab12.firebaseapp.com",
  projectId: "autopilot-7ab12",
  storageBucket: "autopilot-7ab12.appspot.com",
  messagingSenderId: "39033041323",
  appId: "1:39033041323:web:e9ab1b2b69a46ce91b62ee",
  measurementId: "G-TG33L88W6V",
});

// Initialize Firebase
var db = firebase.firestore();
db.useEmulator("localhost", 8080);

// initialize auth
const auth = firebase.auth();
auth.useEmulator("http://localhost:9099");

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

export {db, signInWithGoogle, auth, functions};
