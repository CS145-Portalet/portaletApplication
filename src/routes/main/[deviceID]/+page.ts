import { doc, deleteDoc } from 'firebase/firestore';

import { db } from '$lib/firebase.js';

export function load({ params }) {
	return {
		deviceId: params.deviceID
	};
}

export async function _deleteLog(devID: string, logId: string) {
	if (!confirm('Are you sure you want to delete this device?')) return;
	console.log('Deleting', logId);

	try {
		const logRef = doc(db, 'device', devID, 'device_log', logId);
		console.log(logRef.path);
		await deleteDoc(logRef);
		console.log(`Device ${devID} deleted successfully`);
	} catch (error) {
		console.error('Error deleting device:', error);
		alert('Failed to delete device');
	}
}
