importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: 'AIzaSyAiWiPp7GgMJDs0xm5B-4W8WlCfpT9qNsM',
	authDomain: 'smart-hygiene-cubicle.firebaseapp.com',
	projectId: 'smart-hygiene-cubicle',
	storageBucket: 'smart-hygiene-cubicle.firebasestorage.app',
	messagingSenderId: '557424118461',
	appId: '1:557424118461:web:2e1a819123c25daa5cc5d4',
	measurementId: 'G-J9ZPN5FV8R'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	self.registration.showNotification(payload.notification.title, {
		body: payload.notification.body,

	});
});
