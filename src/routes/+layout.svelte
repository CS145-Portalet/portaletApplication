<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import CirclePlus from '@lucide/svelte/icons/circle-plus';

	let { children } = $props();

</script>

<AppBar>
	{#snippet lead()}
		<a href="/" class="hidden sm:block">
			logo 
		</a>
	{/snippet}

	{#snippet trail()}
		<a href="/addDevice">
			<CirclePlus />
		</a>
	{/snippet}
</AppBar>

{@render children()}
	