// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnv5qpLN3peM_ZefHVECF72pT4SejgZOw",
  authDomain: "indrex-22c70.firebaseapp.com",
  projectId: "indrex-22c70",
  storageBucket: "indrex-22c70.appspot.com",
  messagingSenderId: "218932251969",
  appId: "1:218932251969:web:16f3dcfc87b42b2ce125c0",
  measurementId: "G-HSR02WVZ0B"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default firebase;