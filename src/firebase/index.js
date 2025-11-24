// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8bdlY37Gp-gvZQuJwa6W_nBS_9W98IcE",
  authDomain: "myservice-28f7e.firebaseapp.com",
  projectId: "myservice-28f7e",
  storageBucket: "myservice-28f7e.firebasestorage.app",
  messagingSenderId: "447491660194",
  appId: "1:447491660194:web:b6803bf0af6c836e06fafb",
  measurementId: "G-SR0W86L5QC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);