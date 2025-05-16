<script lang="ts">
	export let data: { deviceId: string };
	import { onMount } from 'svelte';
	import { collection, query, where ,onSnapshot,doc, getDoc } from 'firebase/firestore';
	import type { deviceLog } from '../../../types.js';
	import { db } from '$lib/firebase.js';
    import { numberToUTC } from '$lib/utils.js';
	const statusMap: Record<number, string> = {
		0: 'Dry/No Water',
		1: 'Low',
		2: 'Medium',
		3: 'High Water Level',
		};

	let deviceNickname = '';
	let logArray: deviceLog[] = [];
	console.log(data.deviceId);


	onMount(() => {
		const run = async () => {
			const docQuery = doc(db, "device", data.deviceId);
			const deviceTgt = await getDoc(docQuery);

			if (deviceTgt.exists()) {
				const deviceData = deviceTgt.data();
				deviceNickname = deviceData.nickname ?? 'Unknown Device';
			} else {
				deviceNickname = 'Device Not Found';
			}

			const q = query(collection(doc(db, "device", data.deviceId), "device_log"));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const updatedLog: deviceLog[] = [];
				querySnapshot.forEach((doc) => {
					updatedLog.push(doc.data() as deviceLog);
				});
				logArray = updatedLog;
				console.log("Fetched from Firestore dev log", logArray);
			});

			// Return the unsubscribe cleanup when async work is done
			cleanup = unsubscribe;
		};

		let cleanup = () => {};

		run();

		return () => cleanup(); // must be synchronous
	});


</script>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
		table-layout: fixed; /* enables wrapping */
	}

	th, td {
		border: 2px solid #000;
		padding: 12px;
		white-space: normal; /* allow wrapping */
		word-wrap: break-word;
	}

	/* Optional: limit column width */
	td:nth-child(1), td:nth-child(2) {
		max-width: 200px;
	}
</style>

<table>
	<thead>
		<tr><th colspan="3" style="text-align: center; font-size: 1.2em;">
			Device Log — Viewing Device: {deviceNickname}
		</th></tr>
		<tr>
			<th>Status</th>
			<th>Created_at</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each logArray as deviceLog}
			<tr>
				<td>{statusMap[deviceLog.status_int]} ({deviceLog.status_int})</td>
				<td>{numberToUTC(deviceLog.created_at)}</td>
				<td>
					<button>Delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
