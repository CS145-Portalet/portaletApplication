// Import the functions you need from the SDKs you need
import { deleteApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import type { Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};
/*const firebaseConfig = {
	apiKey: 'AIzaSyAiWiPp7GgMJDs0xm5B-4W8WlCfpT9qNsM',
	authDomain: 'smart-hygiene-cubicle.firebaseapp.com',
	projectId: 'smart-hygiene-cubicle',
	storageBucket: 'smart-hygiene-cubicle.firebasestorage.app',
	messagingSenderId: '557424118461',
	appId: '1:557424118461:web:2e1a819123c25daa5cc5d4',
	measurementId: 'G-J9ZPN5FV8R'
};*/

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
} else {
	firebaseApp = getApps()[0];
	deleteApp(firebaseApp); // Optional if you want a fresh start
	firebaseApp = initializeApp(firebaseConfig);
}
let analytics: Analytics | undefined;

export const db = getFirestore();
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

if (typeof window !== 'undefined') {
	isAnalyticsSupported().then((supported) => {
		if (supported) {
			analytics = getAnalytics(firebaseApp);
		}
	});
}
