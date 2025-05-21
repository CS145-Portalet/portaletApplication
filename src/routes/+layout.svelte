<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import CirclePlus from '@lucide/svelte/icons/circle-plus';

	let { children } = $props();

</script>

<AppBar spaceY="align-middle" background="color-surface-50">
	{#snippet lead()}
		<a href="/" class="hidden sm:block">
			logo 
		</a>

	{/snippet}

	{#snippet trail()}
		<a href="/addDevice" type="button" class="btn btn-sm preset-filled-primary-500 hidden sm:flex" >
			<CirclePlus /><p class="font-semibold">Add Device</p>
		</a>
		<a href="/addDevice" type="button" class="btn preset-filled-primary block sm:hidden">
			<CirclePlus />
		</a>
	{/snippet}
</AppBar>

{@render children()}
	