<script lang="ts">
	export let data: { deviceId: string };
	import { onMount } from 'svelte';
	import { collection, query, where, onSnapshot, doc, getDoc, type DocumentData } from 'firebase/firestore';
	import type { device, deviceLog } from '../../types.js';
	import { db } from '$lib/firebase.js';
	import { numberToUTC } from '$lib/utils.js';
	import { statusMap } from '$lib/constants.js';
	import { _deleteLog } from './+page.js';

	import WaterDrop from '@lucide/svelte/icons/droplet';
    import MapIcon from '@lucide/svelte/icons/map-pinned';

	let deviceNickname = '';
	let deviceStreet = '';
	let deviceCity = '';
	let deviceStatus = 0;
	let deviceCreatedDate = 0;
	let logArray: deviceLog[] = [];

	onMount(() => {
		const run = async () => {
			const docQuery = doc(db, 'device', data.deviceId);
			const deviceTgt = await getDoc(docQuery);

			if (deviceTgt.exists()) {
				const deviceData = deviceTgt.data();
				deviceNickname = deviceData.nickname ?? 'Unknown Device';
				deviceStreet = deviceData.street_address;
				deviceCity = deviceData.City;
				deviceCreatedDate = deviceData.created_at;

			} else {
				deviceNickname = 'Device Not Found';
			}

			const q = query(collection(doc(db, 'device', data.deviceId), 'device_log'));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const updatedLog: deviceLog[] = [];
				querySnapshot.forEach((doc) => {
					updatedLog.push({ ...doc.data(), log_id: doc.id } as deviceLog);
				});

				const sortedLogsDesc = updatedLog.sort((a, b) => b.created_at - a.created_at);
				logArray = sortedLogsDesc;
				console.log('Fetched from Firestore dev log', logArray);
				deviceStatus = logArray[0].status_int;
			});

			// Return the unsubscribe cleanup when async work is done
			cleanup = unsubscribe;
		};

		let cleanup = () => {};

		run();

		return () => cleanup(); // must be synchronous
	});

	function WaterColor(level: number){
		if (level == 3){
			return "Red"
		}
		else if (level == 2){
			return "Yellow"
		}
		else if (logArray.length == 0){
			return "Gray"
		}
		else {return "Green"}
	}
</script>

<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
    <div class="flex justify-items-stretch">
		<div class="grow">
			<p  class="font-medium text-xl mb-1">
				{deviceNickname} 
			</p>
			<p class="text-sm text-gray-400 mb-2"> 
           		<span class="flex">
					<span class="mr-2"><MapIcon strokeWidth={1.5} size={20}/></span>
					{deviceStreet}, {deviceCity}
				</span>
       		</p>
		</div>
		<WaterDrop 
			fill={WaterColor(deviceStatus)}
			strokeWidth={0}
			size={30}
		/>
	</div>
            
	<div class="flex justify-items-stretch">
		<div class="grow text-xs text-primary-950 font-medium">
       		Registered {numberToUTC(deviceCreatedDate)}
		</div>
	</div>    
</div>

<table>
	<thead>
		<tr
			><th colspan="3" style="text-align: center; font-size: 1.2em;">
				Device Log — Viewing Device: {deviceNickname}
			</th></tr
		>
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
					<button on:click={() => _deleteLog(data.deviceId, deviceLog.log_id)}> Delete</button>
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
