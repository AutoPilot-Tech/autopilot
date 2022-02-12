// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCp2f89ZRvYtbaXyCGMuypRq5RJam4omMI',
  authDomain: 'autopilot-335a7.firebaseapp.com',
  projectId: 'autopilot-335a7',
  storageBucket: 'autopilot-335a7.appspot.com',
  messagingSenderId: '315356635877',
  appId: '1:315356635877:web:5a148a4354768046652a0c',
  measurementId: 'G-27631JPTLX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app as firebase };
