/* eslint-disable */
// Firebase messaging service worker
// Version: Firebase 9.x compatible

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new message',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: payload.data || {},
        actions: [
            {
                action: 'view',
                title: 'Xem chi tiết'
            },
            {
                action: 'dismiss',
                title: 'Đóng'
            }
        ],
        requireInteraction: true,
        tag: 'fcm-notification'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        const { type, order_id, ...data } = event.notification.data || {};
        
        switch (type) {
            case 'new_order':
                event.waitUntil(clients.openWindow(`/admin/orders/${order_id}`));
                break;
            case 'order_update':
                event.waitUntil(clients.openWindow(`/admin/orders/${order_id}`));
                break;
            case 'test':
                event.waitUntil(clients.openWindow('/admin/dashboard'));
                break;
            default:
                event.waitUntil(clients.openWindow('/admin/dashboard'));
        }
    } else {
        // Default action - open dashboard
        event.waitUntil(clients.openWindow('/admin/dashboard'));
    }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[firebase-messaging-sw.js] Notification closed:', event);
});

// Service worker installation
self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] Service worker installed');
    self.skipWaiting();
});

// Service worker activation
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Service worker activated');
    event.waitUntil(self.clients.claim());
});

// Handle push events (fallback)
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Push event received:', event);
    
    if (event.data) {
        const data = event.data.json();
        const notificationTitle = data.notification?.title || 'New Notification';
        const notificationOptions = {
            body: data.notification?.body || 'You have a new message',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            data: data.data || {},
            tag: 'push-notification'
        };
        
        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    }
});
/* eslint-enable */