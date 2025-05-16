
import {doc, deleteDoc } from 'firebase/firestore';

import { db } from '$lib/firebase.js';

export function load({ params }) {
	return {
		deviceId: params.deviceID
	};
}


export async function _deleteDevice(id: string) {
	console.log(id);
	
	if (!confirm('Are you sure you want to delete this device?')) return;

	try {
		const deviceRef = doc(db, 'device', id);
		await deleteDoc(deviceRef);
		console.log(`Device ${id} deleted successfully`);
	} catch (error) {
		console.error('Error deleting device:', error);
		alert('Failed to delete device');
	}
}

