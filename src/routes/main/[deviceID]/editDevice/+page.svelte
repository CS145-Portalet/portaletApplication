<script lang="ts">
	import { goto } from '$app/navigation';
	import { doc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';

	import Arrow from '@lucide/svelte/icons/arrow-left';

	export let data;
	console.log(data);
	let pageTitle: string = data.device.nickname;
	let deviceID = data.deviceID;
	let deviceNickname: string = data.device.nickname;
	let deviceCity: string = data.device.city;
	let deviceCreatedDate: number = data.device.created_at;
	let deviceStreetAddress: string = data.device.street_address;
	let loading = false;

	async function editDevice() {
		const deviceRef = doc(db, 'device', deviceID);
		const deviceInfo = {
			nickname: deviceNickname,
			city: deviceCity,
			street_address: deviceStreetAddress,
			created_at: deviceCreatedDate
		};
		console.log(deviceRef.path);

		await updateDoc(deviceRef, deviceInfo);
		console.log(deviceInfo);
		console.log(deviceID);

		goto(`/main/${deviceID}`);
	}

	async function backHandler(){
		goto(`/main/${deviceID}`);
		return 0;
	}
</script>

<div>
	<a href={`/main/${deviceID}`} class="ml-3 flex">
		<Arrow size={25} />
	</a>
</div>


<main class="mt-10">
	<div>
		<!-- Input box -->
		<div class="bg-secondary mx-auto flex max-w-4xl flex-col rounded-lg p-5">
			<h1 class="text-center text-2xl">Edit Device</h1>

			<div class="my-4 flex flex-col">
				<label for="event-name" class="ml-5">
					Device Nickname
				</label>
				<input
					id="device-nickname"
					bind:value={deviceNickname}
					type="text"
					placeholder="Enter a nickname for the device"
					class="border-0 rounded-full bg-primary-50 text-primary-700 py-4 pr-24 pl-5"
				/>
			</div>
			<!-- Device City -->
			<div class="my-4 flex flex-col">
				<label for="event-name" class="ml-5">
					City Location
				</label>
				<input
					id="device-city"
					bind:value={deviceCity}
					type="text"
					placeholder="Enter the city where the device is located"
					class="border-0 rounded-full bg-primary-50 text-primary-700 py-4 pr-24 pl-5"
				/>
			</div>
			<!--Device Street Address-->
			<div class="my-4 flex flex-col">
				<label for="event-name" class="ml-5">
					Street Address
				</label>
				<input
					id="device-streetAddress"
					bind:value={deviceStreetAddress}
					type="text"
					placeholder="Enter the street address where the device is located"
					class="border-0 rounded-full bg-primary-50 text-primary-700 py-4 pr-24 pl-5"
				/>
			</div>

			<button
				disabled={loading}
				on:click={editDevice}
				class="mt-8 btn preset-filled-primary-500 px-8 py-2 disabled:cursor-not-allowed disabled:bg-gray/25"
				>{loading ? 'Editing' : 'Edit'}</button
			>
		</div>
	</div>
</main>
