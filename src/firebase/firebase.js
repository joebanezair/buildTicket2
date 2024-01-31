// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDhFr5yCDRrDHKGmBxbiU43oY5fYRgTd5M",
  authDomain: "sticket-s004.firebaseapp.com",
  databaseURL: "https://sticket-s004-default-rtdb.firebaseio.com/",
  projectId: "sticket-s004",
  storageBucket: "sticket-s004.appspot.com",
  messagingSenderId: "802371056186",
  appId: "1:802371056186:web:10fd562993ade2d5dffb03",
  measurementId: "G-W6SGJ5ZDLW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const database = getDatabase(app)
export const storage = getStorage(app)

