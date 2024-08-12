// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCrpFmYH9UsMgOmMGJwluJwGC0VmE35cz0",
    authDomain: "pantry-tracker-61240.firebaseapp.com",
    projectId: "pantry-tracker-61240",
    storageBucket: "pantry-tracker-61240.appspot.com",
    messagingSenderId: "814645556517",
    appId: "1:814645556517:web:157735eefce80d826596cc",
    measurementId: "G-7VB5Z1FL7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }