<script lang="ts">
	import { onMount } from 'svelte';

	import { collection, query, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import type { device, deviceLog } from '../../types.js';
	import { db } from '$lib/firebase.js';

	import { statusMap } from '$lib/constants.js';
	import { _deleteDevice } from './+page.js';

	import WaterDrop from '@lucide/svelte/icons/droplet';
	import MapIcon from '@lucide/svelte/icons/map-pinned';
	import FilterIcon from '@lucide/svelte/icons/funnel';
	import SortIcon from '@lucide/svelte/icons/arrow-down-wide-narrow';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';

	// Initially populated with sample data
	let deviceArray: device[] = [];
	let filteredEntries: device[] = [];

	const Status = Object.freeze({
		DRY: '0',
		LOW: '1',
		MEDIUM: '2',
		HIGH: '3'
	});
	let currFilterStatus: string;

	let currSort: string = 'dateDESC';

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
		goto(`main/${id}`);
	}
	function editDevice(id: string) {
		goto(`main/${id}/editDevice`);
	}

	let searchTerm = '';
	const searchEntries = () => {
		return (filteredEntries = deviceArray.filter((device) => {
			let deviceName = device.nickname.toLowerCase();
			return deviceName.includes(searchTerm.toLowerCase());
		}));
	};

	function WaterColor(level: string) {
		if (level == 'High') {
			return 'Red';
		} else if (level == 'Medium') {
			return 'Orange';
		} else if (level == 'No Data') {
			return 'Gray';
		} else {
			return 'Green';
		}
	}

	function filterByStatus() {
		if (currFilterStatus == '') {
			filteredEntries = deviceArray;
		} else {
			filteredEntries = deviceArray.filter(
				(device) => device.latest_status == Number(currFilterStatus)
			);
		}

		sortEntriesBy(currSort); // Apply this to persist sort
	}

	function sortEntriesBy(sortChoice: string) {
		if (currSort == sortChoice) {
			currSort = "dateDESC";
			return;
		}

		currSort = sortChoice;

		/*TODO sort by latest device updated 
		if (currSort == "dateDESC"){
			filteredEntries = filteredEntries.sort((previousDevice, nextDevice) =>
				nextDevice.created_at - previousDevice.created_at);
		}
		else if (currSort == "dateASC"){
			filteredEntries = filteredEntries.sort((previousDevice, nextDevice) =>
				previousDevice.created_at - nextDevice.created_at);
		}*/

		if (currSort == 'nameASC') {
			filteredEntries = filteredEntries.sort((a, b) => {
				let previous = a.nickname.toLowerCase();
				let next = b.nickname.toLowerCase();
				if (previous > next) return 1;
				if (previous < next) return -1;
				return 0;
			});
		} else if (currSort == 'nameDESC') {
			filteredEntries = filteredEntries.sort((a, b) => {
				let previous = a.nickname.toLowerCase();
				let next = b.nickname.toLowerCase();

				if (previous < next) return 1;
				if (previous > next) return -1;
				return 0;
			});
		} else if (currSort == 'statusASC') {
			filteredEntries = filteredEntries.sort(
				(previousDevice, nextDevice) => nextDevice.latest_status - previousDevice.latest_status
			);
		} else if (currSort == 'statusDESC') {
			filteredEntries = filteredEntries.sort(
				(previousDevice, nextDevice) => previousDevice.latest_status - nextDevice.latest_status
			);
		}
	}
</script>

<div
	class="bg-secondary-500 mx-3 flex grid-cols-[auto_1fr_auto] items-center space-y-4 rounded-full p-2 align-middle mb-3"
>
	<input
		type="text"
		class="text-primary-700 ml-2 w-full border-0 outline-hidden"
		id="search-field"
		placeholder="Search by Name"
		autocomplete="off"
		bind:value={searchTerm}
		oninput={searchEntries}
	/>
</div>

<div class="mx-3 mb-2 flex items-center gap-1">
	<FilterIcon color="#0170f3" strokeWidth={1.5} />

	<select
		class={`chip mr-2 pr-7 capitalize ${currFilterStatus !== '' ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
		bind:value={currFilterStatus}
		onchange={() => filterByStatus()}
	>
		<option value={''}> Status </option>

		{#each Object.entries(Status) as [key, status], index (key)}
			<option value={status}>
				{key}
				{status}
			</option>
		{/each}
	</select>

	<SortIcon color="#0170f3" strokeWidth={1.5} fill="#0170f3" />

	<!-- TODO add "dateDESC", "dateASC", -->
	<button
		type="button"
		class={`chip capitalize ${currSort === 'nameDESC' ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
		onclick={() => sortEntriesBy('nameDESC')}
	>
		Name <ArrowDown size={16} />
	</button>

	<button
		type="button"
		class={`chip capitalize ${currSort === 'nameASC' ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
		onclick={() => sortEntriesBy('nameASC')}
	>
		Name <ArrowUp size={16} />
	</button>

	<button
		type="button"
		class={`chip capitalize ${currSort === 'statusDESC' ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
		onclick={() => sortEntriesBy('statusDESC')}
	>
		Status <ArrowDown size={16} />
	</button>

	<button
		type="button"
		class={`chip capitalize ${currSort === 'statusASC' ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
		onclick={() => sortEntriesBy('statusASC')}
	>
		Status <ArrowUp size={16} />
	</button>
</div>


{#if deviceArray.length == 0}
	<!-- loading eme-->
	<div class="my-3 flex items-center justify-center space-x-4">
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
	</div>
	<div class="my-3 flex items-center justify-center space-x-4">
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
	</div>
	<div class="my-3 flex items-center justify-center space-x-4">
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
	</div>
	<div class="my-3 flex items-center justify-center space-x-4">
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
	</div>
	<div class="my-3 flex items-center justify-center space-x-4">
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle size-16 animate-pulse"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
		<div class="placeholder-circle hidden size-16 animate-pulse sm:block"></div>
	</div>
{:else}
	<div class="w-full">
		{#each filteredEntries as device}
			<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
				<div class="flex justify-items-stretch">
					<div class="grow">
						<p class="mb-1 text-xl font-medium">
							{device.nickname}
						</p>
						<p class="mb-2 text-sm text-gray-400">
							<span class="flex">
								<span class="mr-2"><MapIcon strokeWidth={1.5} size={20} /></span>
								{device.street_address}, {device.city}
							</span>
						</p>
					</div>
					<span class="flex">
						<WaterDrop
							fill={WaterColor(statusMap[device.latest_status])}
							strokeWidth={0}
							size={30}
						/>
					</span>
				</div>

				<div class="flex justify-items-stretch">
					<div class="grow">
						<button
							onclick={() => goToDevice(device.device_id)}
							class="text-primary-950 text-xs font-medium"
						>
							...view portalet logs
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
