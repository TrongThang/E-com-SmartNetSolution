import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDDG_6dS0sQf-ST3ZjzLCOO7JnhbA93Sek",
    authDomain: "homeconnect-teamiot.firebaseapp.com",
    projectId: "homeconnect-teamiot",
    storageBucket: "homeconnect-teamiot.firebasestorage.app",
    messagingSenderId: "697438598174",
    appId: "1:697438598174:web:0fb3109284f665c5532a0f",
    measurementId: "G-PVR53BGMC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };