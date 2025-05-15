<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import type { device } from '../../types.js';
	import { db } from '$lib/firebase.js';
    import { numberToUTC } from '$lib/utils.js';
	// Initially populated with sample data
	let deviceArray: device[] = [];

	onMount(() => {
		const q = query(collection(db, "device"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const updatedDevices: device[] = [];
			querySnapshot.forEach((doc) => {
				updatedDevices.push({...doc.data(),device_id:doc.id} as device);
			});
			deviceArray = updatedDevices; // Replace sample with Firestore data
			console.log("Fetched from Firestore", deviceArray);
		});

		return () => unsubscribe();
	});

	function goToDevice(id: string) {
		goto(`/deviceTable/${id}`);
	}


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
<table border="4" cellpadding="20" cellspacing="5">
	<thead>
		<tr><th colspan="5" style="text-align: center; font-size: 1.2em;">
			Device Table
		</th></tr>
		<tr>
			<th>Device Name</th>
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
				<td>{device.street_address}</td>
				<td>{device.city}</td>
				<td>{numberToUTC(device.created_at)}</td>
				<td>
					<button on:click={() => goToDevice(device.device_id)}>
						View
					</button>
					<button>
						Force Update
					</button>
				</td>
				
			</tr>
		{/each}
	</tbody>
</table>