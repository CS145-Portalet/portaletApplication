	import {doc, deleteDoc,collection,query } from 'firebase/firestore';

	import { db } from '$lib/firebase.js';

export async function _deleteLog(id: string) {
    console.log(id);
    
	if (!confirm('Are you sure you want to delete this device?')) return;

	try {
		const deviceRef = doc(db, "device", id,"device_log") ;
		await deleteDoc(deviceRef);
		console.log(`Device ${id} deleted successfully`);
	} catch (error) {
		console.error('Error deleting Log:', error);
		alert('Failed to delete log');
	}
}
