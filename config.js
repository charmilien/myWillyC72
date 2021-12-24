import firebase from 'firebase'
require("firebase/firestore")

const firebaseConfig = {
    apiKey: "AIzaSyCYSO8Zyx2t5zFBlrYbKH2pCo8FGuAhClY",
    authDomain: "elibrary-3147c.firebaseapp.com",
    projectId: "elibrary-3147c",
    storageBucket: "elibrary-3147c.appspot.com",
    messagingSenderId: "326341995455",
    appId: "1:326341995455:web:f4588d234e1e31e0c80f0a"
  };
  
  // Initialize Firebase
 
   firebase.initializeApp(firebaseConfig);
  
  export default firebase.firestore();