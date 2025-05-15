<script lang="ts">
	export let data: { deviceId: string };
	import { onMount } from 'svelte';
	import { collection, query, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import type { deviceLog } from '../../../types.js';
	import { db } from '$lib/firebase.js';

	// Initially populated with sample data
	let logArray: deviceLog[] = [];

	onMount(() => {
		const q = query(collection(db, "device"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const updatedLog: deviceLog[] = [];
			querySnapshot.forEach((doc) => {
				updatedLog.push(doc.data() as deviceLog);
			});
			logArray = updatedLog; // Replace sample with Firestore data
			console.log("Fetched from Firestore", logArray);
		});

		return () => unsubscribe();
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
		<tr><th>Device Log - Viewing Device: {data.deviceId}</th></tr>
		<tr>
			<th>Status</th>
			<th>Created_at</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each logArray as deviceLog}
			<tr>
				<td>{deviceLog.status}</td>
				<td>{deviceLog.created_at}</td>
				<td>
					<button>Delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
