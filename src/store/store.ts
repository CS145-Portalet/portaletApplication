import { auth, googleProvider, db, messaging } from '$lib/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { getToken } from 'firebase/messaging';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';


export const authStore = writable<{
	user: User | null;
}>({
	user: null
});

export const authHandlers = {
	logout: async () => {
		await auth.signOut();
		goto('/');
	},
	loginWithGoogle: async () => {
		try {
			if (!browser) return;
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			console.log("✅ Logged in as:", user.displayName);

			// Register the service worker
			const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
			console.log("✅ Service worker registered.");

			// Get FCM token
			const token = await getToken(messaging, {
				vapidKey: 'BInVZqEQz42Bnv7WR5Ktgo8ZMg0h-MLUGN40YH2J8XvUUAqyeisG2Je0h7hn2hPhSDCbscy58MUl7yqs7M3VKjc',
				serviceWorkerRegistration: registration
			});

			console.log("FCM Token received:", token);

			// Save token to Firestore
			await setDoc(doc(db, 'fcmTokens', user.uid), {
				token,
				updatedAt: serverTimestamp()
			});
			console.log("Token saved to Firestore");

			// Redirect
			goto('/main');
		} catch (error) {
			console.error("❌ Login failed:", error);
			// Optionally show an error to the user
		};
	}
};