// Firebase Configuration
// Copy this file to .env and fill in your actual values

export const FIREBASE_CONFIG = {
    // VAPID Key (Required for FCM)
    // Get this from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
    VAPID_KEY: process.env.REACT_APP_FIREBASE_VAPID_KEY || 'your-vapid-key-here',
    
    // Firebase Config
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDDG_6dS0sQf-ST3ZjzLCOO7JnhbA93Sek',
    AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'homeconnect-teamiot.firebaseapp.com',
    PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'homeconnect-teamiot',
    STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'homeconnect-teamiot.firebasestorage.app',
    MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '697438598174',
    APP_ID: process.env.REACT_APP_FIREBASE_APP_ID || '1:697438598174:web:0fb3109284f665c5532a0f',
    MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-PVR53BGMC1'
};

// Instructions for setup:
// 1. Create a .env file in the frontend directory
// 2. Add your VAPID key: REACT_APP_FIREBASE_VAPID_KEY=your-actual-vapid-key
// 3. Restart your development server 