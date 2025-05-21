<script lang="ts">
	import { onMount } from 'svelte';

	import { collection, query, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import type { device, deviceLog } from '../types.js';
	import { db } from '$lib/firebase.js';
	import { numberToUTC } from '$lib/utils.js';

	import { statusMap } from '$lib/constants.js';
	import { _deleteDevice } from './+page.js';

    import WaterDrop from '@lucide/svelte/icons/droplet';
    import MapIcon from '@lucide/svelte/icons/map-pinned';

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

	function WaterColor(level: string){
		if (level == "High"){
			return "Red"
		}
		else if (level == "Medium"){
			return "Yellow"
		}
		else if (level == "No Data"){
			return "Gray"
		}
		else {return "Green"}
	}
</script>

{#if deviceArray.length==0}
	<!-- loading eme-->
    <div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
		<div class="flex items-center justify-center space-x-4 my-3">
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
		</div>
	</div>
	<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
		<div class="flex items-center justify-center space-x-4 my-3">
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
		</div>
	</div>
	<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
		<div class="flex items-center justify-center space-x-4 my-3">
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
		</div>
	</div>
	<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
		<div class="flex items-center justify-center space-x-4 my-3">
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
		</div>
	</div>
	<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
		<div class="flex items-center justify-center space-x-4 my-3">
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
			<div class="placeholder-circle size-16 animate-pulse"></div>
		</div>
	</div>
{:else}
    <div class="w-full">
    {#each deviceArray as device}
        <div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
            <div class="flex justify-items-stretch">
				<div class="grow">
					<p  class="font-medium text-xl mb-1">
						{device.nickname} 
					</p>
					<p class="text-sm text-gray-400 mb-2"> 
                		<span class="flex">
							<span class="mr-2"><MapIcon strokeWidth={1.5} size={20}/></span>
							{device.street_address}, {device.city}
						</span>
            		</p>
				</div>
				<WaterDrop 
					fill={WaterColor(statusMap[device.latest_status])}
					strokeWidth={0}
					size={30}
				/>
			</div>
            
            <button on:click={() => goToDevice(device.device_id)} class="text-xs text-primary-950 font-medium"> ...view portalet logs </button>
        </div>
    {/each}
    </div>

{/if}

<table border="4" cellpadding="20" cellspacing="5">
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
