import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// we have to use .env file to made this secure
const firebaseApp = firebase.initializeApp(
  {
    apiKey: "AIzaSyBV2iaIjuA61sggqYhhmkfiCdUC7Y6BaF0",
    authDomain: "intern-c1b40.firebaseapp.com",
    projectId: "intern-c1b40",
    storageBucket: "intern-c1b40.appspot.com",
    messagingSenderId: "9051401699",
    appId: "1:9051401699:web:5186d79622d64b280d04d6"

  }
);


  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  export {db, auth, storage}