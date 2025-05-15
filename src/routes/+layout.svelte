<script lang="ts">
	import '../app.css';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	let { children } = $props();
</script>

<div></div>
<div>
	<Navigation.Bar>
		<Navigation.Tile label="Home"  href="/"></Navigation.Tile>
		<Navigation.Tile label="Device Table" href="/deviceTable"></Navigation.Tile>
		<Navigation.Tile label="Settings"></Navigation.Tile>
	</Navigation.Bar>
</div>

{@render children()}
