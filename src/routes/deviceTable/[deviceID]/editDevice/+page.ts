import type { PageLoad } from './$types.js';
import { doc, getDoc,query } from 'firebase/firestore';
import { db } from '$lib/firebase.js';
export const load: PageLoad = async ({params}) => {
	const deviceID=params.deviceID;
	const docQuery = doc(db,'device',deviceID);

	

	const snapshot = await getDoc(docQuery);
	

	if (!snapshot.exists()) {
		throw new Error(`Device with ID ${deviceID} not found.`);
	}
	
	// You can return any data you want to pass to the page component
	return {

		device: snapshot.data(),
		deviceID
	};
};
