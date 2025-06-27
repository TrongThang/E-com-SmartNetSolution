import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";
import { FIREBASE_CONFIG } from "./firebase-config";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_CONFIG.API_KEY,
    authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
    projectId: FIREBASE_CONFIG.PROJECT_ID,
    storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
    messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID,
    appId: FIREBASE_CONFIG.APP_ID,
    measurementId: FIREBASE_CONFIG.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize messaging only if supported
let messaging = null;
isSupported().then((supported) => {
    if (supported) {
        messaging = getMessaging(app);
        console.log('Firebase messaging initialized successfully');
    } else {
        console.log('Firebase messaging not supported in this browser');
    }
}).catch((error) => {
    console.error('Error checking messaging support:', error);
});

export { app, analytics, messaging, FIREBASE_CONFIG };