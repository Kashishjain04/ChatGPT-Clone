import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDaOdOPGNaLlz6OQDx-a81N42giCsqCAW8",
	authDomain: "kj-chatgpt.firebaseapp.com",
	projectId: "kj-chatgpt",
	storageBucket: "kj-chatgpt.appspot.com",
	messagingSenderId: "289214491107",
	appId: "1:289214491107:web:e45f2df61ec5adcd8518d6",
	measurementId: "G-8B303H2Q70",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
