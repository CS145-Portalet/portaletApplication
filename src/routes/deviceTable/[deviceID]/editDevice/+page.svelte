

<script lang="ts">
	import { goto } from '$app/navigation';
    import { doc, updateDoc, } from 'firebase/firestore';
    import { db } from '$lib/firebase.js';

    
    export let data;
    console.log(data);
    let pageTitle:string=data.device.nickname;
    let deviceID = data.deviceID;
	let deviceNickname: string=data.device.nickname;
	let deviceCity: string=data.device.city;
	let deviceCreatedDate: number=data.device.created_at;
	let deviceStreetAddress: string=data.device.street_address;
	let loading = false;

    async function editDevice(){
        
        
        const deviceRef = doc(db, 'device', deviceID);
        const deviceInfo = {
			nickname: deviceNickname,
			city: deviceCity,
			street_address: deviceStreetAddress ,
            created_at :deviceCreatedDate 

		};
        console.log(deviceRef.path);
        
        await updateDoc(deviceRef, deviceInfo);
        console.log(deviceInfo);
        
        goto('/deviceTable');

    }
	
/*
	async function createDevice() {
		if (deviceNickname === undefined && deviceCity === undefined|| deviceNickname===""&&deviceCity==="" ||   loading === true)
			return alert('Fields cannot be empty');
        if (!deviceNickname || deviceNickname.trim() === "") {
            return alert("Device nickname cannot be empty");
        }
        if (!deviceCity || deviceCity.trim() === "") {
            return alert("Device city cannot be empty");
        }
        if (loading) {
            return;
        }

		loading = true;
        deviceCreatedDate=Date.now();
		const deviceInfo = {
			nickname: deviceNickname,
			city: deviceCity,
			street_address: deviceStreetAddress ,
            created_at :deviceCreatedDate 

		};
        console.log(deviceInfo);

		try {
            const devCollection = collection(db, "device");
			await addDoc(devCollection,deviceInfo);
			goto('/deviceTable');
		} catch (error) {
			console.log(`An error occured while creating a document ${error}`);
		}
		loading = false
	}
*/
	
</script>

<main class="text-gray-100 mt-10">
	<div>
		<!-- Input box -->
		<div class="max-w-4xl mx-auto bg-secondary rounded-lg flex flex-col p-5">
			<h1 class="text-center text-white text-2xl">Edit Device {pageTitle}</h1>

			<div class="flex flex-col my-4">
				<label for="event-name">Device Nickname</label>
				<input
					id="device-nickname"
					bind:value={deviceNickname}
					type="text"
					placeholder="Enter a nickname for the device"
					class="py-4 pl-5 pr-24 bg-transparent border border-borderclr"
				/>
			</div>
			<!-- Device City -->
			<div class="flex flex-col my-4">
				<label for="event-name">City Location</label>
				<input
					id="device-city"
					bind:value={deviceCity}
					type="text"
					placeholder="Enter the city where the device is located"
					class="py-4 pl-5 pr-24 bg-transparent border border-borderclr"
				/>
			</div>
            <!--Device Street Address-->
            <div class="flex flex-col my-4">
				<label for="event-name">Street Address</label>
				<input
					id="device-streetAddress"
					bind:value={deviceStreetAddress}
					type="text"
					placeholder="Enter the street address where the device is located"
					class="py-4 pl-5 pr-24 bg-transparent border border-borderclr"
				/>
			</div>

			

			<button
				disabled={loading}
				on:click={editDevice}
				class="py-2 px-8 bg-white text-black mt-8 disabled:bg-white/25 disabled:cursor-not-allowed"
				>{loading ? 'Editing' : 'Edit'}</button
			>
		</div>
	</div>
</main>