import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBheVRhUiNeOs_xRZcDNdIBiqtqYJyPmAQ",
    authDomain: "lounge-application-ac21b.firebaseapp.com",
    databaseURL: "https://lounge-application-ac21b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lounge-application-ac21b",
    storageBucket: "lounge-application-ac21b.appspot.com",
    messagingSenderId: "208829721166",
    appId: "1:208829721166:web:34f0f91fc8e2a541be311f",
    measurementId: "G-7FJ75TSW5T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
export default app;