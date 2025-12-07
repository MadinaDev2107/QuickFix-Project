import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnz-MuqqfDWdQlRZGMg5LqlgR-v6_cFsA",
  authDomain: "start-up-project-m.firebaseapp.com",
  projectId: "start-up-project-m",
  storageBucket: "start-up-project-m.appspot.com",
  messagingSenderId: "1021501065502",
  appId: "1:1021501065502:web:eb06bb364532034abca10f",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
