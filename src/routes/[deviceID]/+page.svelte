<script lang="ts">
	export let data: { deviceId: string };
	import { onMount } from 'svelte';
	import {
		collection,
		query,
		where,
		onSnapshot,
		doc,
		getDoc,
		type DocumentData
	} from 'firebase/firestore';
	import type { device, deviceLog } from '../../types.js';
	import { db } from '$lib/firebase.js';
	import { numberToUTC } from '$lib/utils.js';
	import { statusMap } from '$lib/constants.js';
	import { _deleteLog } from './+page.js';
	import { goto } from '$app/navigation';

	import WaterDrop from '@lucide/svelte/icons/droplet';
	import MapIcon from '@lucide/svelte/icons/map-pinned';
	import Arrow from '@lucide/svelte/icons/arrow-left';
	import FilterIcon from '@lucide/svelte/icons/funnel';

	let deviceNickname = '';
	let deviceStreet = '';
	let deviceCity = '';
	let deviceStatus = 0;
	let deviceCreatedDate = 0;
	let rawLogs: deviceLog[] = [];
	let organizedLogs: deviceLog[] = [];
	let deviceID = '';

	const Status = Object.freeze({ 
		DRY: '0',
		LOW: '1',
		MEDIUM: '2',
		HIGH: '3',
	});
	let currFilterStatus: string;
	
	let currSort: string = '';

	onMount(() => {
		const run = async () => {
			const docQuery = doc(db, 'device', data.deviceId);
			const deviceTgt = await getDoc(docQuery);
			deviceID = deviceTgt.id;
			if (deviceTgt.exists()) {
				const deviceData = deviceTgt.data();
				deviceNickname = deviceData.nickname ?? 'Unknown Device';
				deviceStreet = deviceData.street_address;
				deviceCity = deviceData.city;
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

				organizedLogs = updatedLog.sort((a, b) => b.created_at - a.created_at);
				rawLogs = organizedLogs;
				console.log('Fetched from Firestore dev log', rawLogs);
				deviceStatus = rawLogs[0].status_int;
			});

			// Return the unsubscribe cleanup when async work is done
			cleanup = unsubscribe;
		};

		let cleanup = () => {};

		run();

		return () => cleanup(); // must be synchronous
	});

	function editDevice(id: string) {
		goto(`${id}/editDevice`);
	}

	function WaterColor(level: number) {
		if (level == 3) {
			return 'Red';
		} else if (level == 2) {
			return 'Yellow';
		} else if (rawLogs.length == 0) {
			return 'Gray';
		} else {
			return 'Green';
		}
	}
	
	function filterByStatus() {

		if (currFilterStatus == ''){
			organizedLogs = rawLogs;
		}
		else{
			organizedLogs = rawLogs.filter(
				(log) => log.status_int == Number(currFilterStatus)
			);
			
		}

		sortByDate(currSort); // Apply this to persist sort
	}

	function sortByDate(sortChoice: string){
		currSort = sortChoice

		if(currSort == "dateDESC"){
			organizedLogs = organizedLogs.sort((previousLog, nextLog) =>
				nextLog.created_at - previousLog.created_at);
		}
		else{
			organizedLogs = organizedLogs.sort((previousLog, nextLog) =>
				previousLog.created_at - nextLog.created_at);
		}
	}

</script>

<div>
	<a href="/" class="ml-3 flex"><Arrow size={25} /></a>
</div>

{#if deviceNickname == ''}
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
	<div class="card preset-outlined-primary-500 mx-3 my-3 p-4">
		<div class="flex justify-items-stretch">
			<div class="grow">
				<p class="mb-1 text-xl font-medium">
					{deviceNickname}
				</p>
				<p class="mb-2 text-sm text-gray-400">
					<span class="flex">
						<span class="mr-2"><MapIcon strokeWidth={1.5} size={20} /></span>
						{deviceStreet}, {deviceCity}
					</span>
				</p>
			</div>
			<WaterDrop fill={WaterColor(deviceStatus)} strokeWidth={0} size={30} />
		</div>

		<div class="flex justify-items-stretch">
			<div class="text-primary-950 grow grow text-xs font-medium">
				Registered {numberToUTC(deviceCreatedDate)}
			</div>
			<button
				type="button"
				class="btn btn-sm preset-filled-primary-500 italic"
				onclick={() => editDevice(deviceID)}
			>
				Edit
			</button>
		</div>
	</div>
{/if}

<div class="mx-3 mb-2 flex items-center gap-4">
	<FilterIcon fill="#0170f3" strokeWidth={0} />

	<select
		class={`chip capitalize ${currFilterStatus !== '' ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
		bind:value={currFilterStatus}
		onchange={() => filterByStatus()}
	>
		<option value={''}>
			Status
		</option>
		{#each Object.entries(Status) as [key, status], index(key)}
			<option value={status}>
				{key} {status}
			</option>
		{/each}
	</select>
</div>

{#if rawLogs.length == 0} <!-- Loading Screen -->
	<div class="w-full space-y-4">
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
	</div>
{:else}
	{#each organizedLogs as deviceLog}
		<div><!--to display device logs here insead of table--></div>
	{/each}
{/if}

<table>
	<thead>
		<tr>
			<th>Status</th>
			<th>Logged At
				{#each ["dateASC", "dateDESC"] as sortChoice}
					<button
						type="button"
						class={`chip capitalize ${currSort === sortChoice ? 'preset-filled-tertiary-500' : 'preset-filled-secondary-500'} `}
						onclick={() => sortByDate(sortChoice)}
					>
						{sortChoice}
					</button>
				{/each}
			</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each organizedLogs as deviceLog}
			<tr>
				<td>{statusMap[deviceLog.status_int]} ({deviceLog.status_int})</td>
				<td>{numberToUTC(deviceLog.created_at)}</td>
				<td>
					<button onclick={() => _deleteLog(data.deviceId, deviceLog.log_id)}> Delete</button>
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
