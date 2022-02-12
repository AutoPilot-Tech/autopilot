// Import the functions you need from the SDKs you need
import firebase from 'firebase/app'; // Required for side-effects
import 'firebase/firestore';

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: 'AIzaSyCp2f89ZRvYtbaXyCGMuypRq5RJam4omMI',
  authDomain: 'autopilot-335a7.firebaseapp.com',
  projectId: 'autopilot-335a7',
  storageBucket: 'autopilot-335a7.appspot.com',
  messagingSenderId: '315356635877',
  appId: '1:315356635877:web:5a148a4354768046652a0c',
  measurementId: 'G-27631JPTLX',
});

// Initialize Firebase
var db = firebase.firestore();

export { db };
