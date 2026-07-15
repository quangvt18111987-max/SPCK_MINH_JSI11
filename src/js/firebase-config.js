// Firebase Configuration - Using compat (v10) SDK
const firebaseConfig = {
    apiKey: "AIzaSyDTNtz5SfUtWr4ZktE_4V--VVVBo4vPrJM",
    authDomain: "spck-89d8c.firebaseapp.com",
    projectId: "spck-89d8c",
    storageBucket: "spck-89d8c.firebasestorage.app",
    messagingSenderId: "473190019268",
    appId: "1:473190019268:web:71f89b047140f0061bd991",
    measurementId: "G-7DHW507QHX"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global instances for Authentication and Cloud Firestore
const db = firebase.firestore();
const auth = firebase.auth();
