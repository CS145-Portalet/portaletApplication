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
		<a href="/addDevice" type="button" class="bg-surface-200 rounded-full p-1">
			<CirclePlus />
		</a>
	{/snippet}
</AppBar>

{@render children()}
	