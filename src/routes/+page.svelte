<script lang="ts">
	import { onMount } from 'svelte';

	import { collection, query, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import type { device, deviceLog } from '../types.js';
	import { db } from '$lib/firebase.js';

	import { statusMap } from '$lib/constants.js';
	import { _deleteDevice } from './+page.js';

    import WaterDrop from '@lucide/svelte/icons/droplet';
    import MapIcon from '@lucide/svelte/icons/map-pinned';
	import SearchIcon from '@lucide/svelte/icons/search';

	// Initially populated with sample data
	let deviceArray: device[] = [];
	let filteredEntries: device[] = [];

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
					filteredEntries = deviceArray;
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

	let searchTerm = "";
	const searchEntries = () => {	
		return filteredEntries = deviceArray.filter(device => {
			let deviceName = device.nickname.toLowerCase();
			return deviceName.includes(searchTerm.toLowerCase())
		});
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

<div class="flex grid-cols-[auto_1fr_auto] space-y-4 mx-3 align-middle items-center bg-secondary-500 p-2 rounded-full">
	<input type="text" 
		class="w-full border-0 outline-hidden ml-2 text-primary-700"
		id="search-field" 
		placeholder="Search by Name" 
		autocomplete="off"
		bind:value={searchTerm}
		on:input={searchEntries} 
	/>
</div>

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
            
			<div class="flex justify-items-stretch">
				<div class="grow">
            		<button on:click={() => goToDevice(device.device_id)} class="text-xs text-primary-950 font-medium"> ...view portalet logs </button>
				</div>

			</div>
        </div>
    {/each}
    </div>

{/if}

<style>
	#search-field {
		border: 0px;
	}
</style>
<!-- <table border="4" cellpadding="20" cellspacing="5">
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
				</td>
			</tr>
		{/each}
	</tbody>
</table>

</style> -->
