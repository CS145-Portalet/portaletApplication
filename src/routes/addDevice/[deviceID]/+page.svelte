<script lang="ts">
	export let data: { deviceID: string };
	import { goto } from '$app/navigation';
    console.log(data.deviceID);
</script>


<main class="mt-10">
	<div>
        <p>Your device has been added! Please make sure to save this as the device's unique ID</p>
        <p>{data.deviceID}</p>
        <button
            type="button"
            class="btn btn-sm preset-filled-primary-500 italic"
            onclick={() => goto(`/main`)}>
            Go back to Dashboard
        </button>
	</div>
</main>
