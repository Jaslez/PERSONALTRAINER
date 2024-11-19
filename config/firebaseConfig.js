import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDqDMX_TwZ0lUwZeCLWzS1-Ct4sw0saDZg",
    authDomain: "personal-trainer-app-56cd0.firebaseapp.com",
    projectId: "personal-trainer-app-56cd0",
    storageBucket: "personal-trainer-app-56cd0.appspot.com",
    messagingSenderId: "62759644175",
    appId: "1:62759644175:web:0d8c92f4ec63dcfef5c77a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
