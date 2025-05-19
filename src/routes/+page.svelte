<script lang="ts">
	import { onMount } from 'svelte';

	import { collection, query, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import type { device, deviceLog } from '../types.js';
	import { db } from '$lib/firebase.js';
	import { numberToUTC } from '$lib/utils.js';

	import { statusMap } from '$lib/constants.js';
	import { _deleteDevice } from './+page.js';

	// Initially populated with sample data
	let deviceArray: device[] = [];

	onMount(() => {
		const q = query(collection(db, 'device'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log('hello there');
			(async () => {
				try {
					console.log('general kenobi');
					const updatedDevices: device[] = [];
					for (const doc of querySnapshot.docs) {
						const deviceData = { ...doc.data(), device_id: doc.id } as device;

						const logsSnapshot = await getDocs(collection(doc.ref, 'device_log'));
						const deviceLogs: deviceLog[] = [];
						if (!logsSnapshot.empty) {
							logsSnapshot.forEach((doc) => {
								deviceLogs.push({
									...doc.data(),
									log_id: doc.id
								} as deviceLog);
							});
						}
						const sortedLogsDesc = deviceLogs.sort((a, b) => b.created_at - a.created_at);

						const latestStatus = sortedLogsDesc[0] === undefined ? 4 : sortedLogsDesc[0].status_int;
						//console.log(latestStatus);

						updatedDevices.push({ ...deviceData, latest_status: latestStatus });
					}
					deviceArray = updatedDevices;
					console.log('Devices with latest logs:', deviceArray);
				} catch (error) {
					console.error('Error fetching latest logs:', error);
				}
			})();
		});

		return () => unsubscribe();
	});

	function goToDevice(id: string) {
		goto(`${id}`);
	}
	function editDevice(id: string) {
		goto(`${id}/editDevice`);
	}
</script>

<table border="4" cellpadding="20" cellspacing="5">
	<thead>
		<tr><th colspan="6" style="text-align: center; font-size: 1.2em;"> Device Table </th></tr>
		<tr>
			<th>Device Name</th>

			<th>Status</th>
			<th>Street Address</th>
			<th>City</th>
			<th>Created At</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each deviceArray as device}
			<tr>
				<td>{device.nickname}</td>
				<td>{statusMap[device.latest_status]}</td>
				<td>{device.street_address}</td>
				<td>{device.city}</td>
				<td>{numberToUTC(device.created_at)}</td>
				<td>
					<button on:click={() => goToDevice(device.device_id)}> View </button>

					<button on:click={() => editDevice(device.device_id)}> Edit </button>
					<!--<button on:click={() => _deleteDevice(device.device_id)}> Delete (Inactive) </button>-->
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
		table-layout: fixed; /* enables wrapping */
	}

	th,
	td {
		border: 2px solid #000;
		padding: 12px;
		white-space: normal; /* allow wrapping */
		word-wrap: break-word;
	}

	/* Optional: limit column width */
	td:nth-child(1),
	td:nth-child(2) {
		max-width: 200px;
	}
</style>
