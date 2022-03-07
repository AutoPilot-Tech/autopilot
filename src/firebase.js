// Import the functions you need from the SDKs you need
import firebase from 'firebase/app'; // Required for side-effects
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyByQ9uymQz0xR06INhjGTIQPFlYAaE-Rgg",
  authDomain: "autopilot-7ab12.firebaseapp.com",
  projectId: "autopilot-7ab12",
  storageBucket: "autopilot-7ab12.appspot.com",
  messagingSenderId: "39033041323",
  appId: "1:39033041323:web:e9ab1b2b69a46ce91b62ee",
  measurementId: "G-TG33L88W6V"
});

// Initialize Firebase
var db = firebase.firestore();

// initialize auth
var auth = firebase.auth();

export { db, auth };
