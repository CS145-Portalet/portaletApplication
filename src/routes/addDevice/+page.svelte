<script lang="ts">
	import { goto } from '$app/navigation';
	import { doc, addDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';

	let deviceNickname: string;
	let deviceCity: string;
	let deviceCreatedDate: number;
	let deviceStreetAddress: string;
	let loading = false;

	async function createDevice() {
		if (
			(deviceNickname === undefined && deviceCity === undefined) ||
			(deviceNickname === '' && deviceCity === '') ||
			loading === true
		)
			return alert('Fields cannot be empty');
		if (!deviceNickname || deviceNickname.trim() === '') {
			return alert('Device nickname cannot be empty');
		}
		if (!deviceCity || deviceCity.trim() === '') {
			return alert('Device city cannot be empty');
		}
		if (loading) {
			return;
		}

		loading = true;
		deviceCreatedDate = Date.now();
		const deviceInfo = {
			nickname: deviceNickname,
			city: deviceCity,
			street_address: deviceStreetAddress,
			created_at: deviceCreatedDate
		};
		console.log(deviceInfo);

		try {
			const devCollection = collection(db, 'device');
			await addDoc(devCollection, deviceInfo);
			goto('/deviceTable');
		} catch (error) {
			console.log(`An error occured while creating a document ${error}`);
		}
		loading = false;
	}
</script>

<main class="mt-10 text-gray-100">
	<div>
		<!-- Input box -->
		<div class="bg-secondary mx-auto flex max-w-4xl flex-col rounded-lg p-5">
			<h1 class="text-center text-2xl text-white">Create New Device</h1>

			<div class="my-4 flex flex-col">
				<label for="event-name">Device Nickname</label>
				<input
					id="device-nickname"
					bind:value={deviceNickname}
					type="text"
					placeholder="Enter a nickname for the device"
					class="border-borderclr border bg-transparent py-4 pr-24 pl-5"
				/>
			</div>
			<!-- Device City -->
			<div class="my-4 flex flex-col">
				<label for="event-name">City Location</label>
				<input
					id="device-city"
					bind:value={deviceCity}
					type="text"
					placeholder="Enter the city where the device is located"
					class="border-borderclr border bg-transparent py-4 pr-24 pl-5"
				/>
			</div>
			<!--Device Street Address-->
			<div class="my-4 flex flex-col">
				<label for="event-name">Street Address</label>
				<input
					id="device-streetAddress"
					bind:value={deviceStreetAddress}
					type="text"
					placeholder="Enter the street address where the device is located"
					class="border-borderclr border bg-transparent py-4 pr-24 pl-5"
				/>
			</div>

			<button
				disabled={loading}
				on:click={createDevice}
				class="mt-8 bg-white px-8 py-2 text-black disabled:cursor-not-allowed disabled:bg-white/25"
				>{loading ? 'Creating' : 'Create'}</button
			>
		</div>
	</div>
</main>
