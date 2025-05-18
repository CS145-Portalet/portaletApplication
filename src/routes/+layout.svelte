<script lang="ts">
	import '../app.css';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	import IconMenu from '@lucide/svelte/icons/menu';
	import IconHome from '@lucide/svelte/icons/house';
	import IconSettings from '@lucide/svelte/icons/settings';
	import User from '@lucide/svelte/icons/circle-user';
	import CircleUser from '@lucide/svelte/icons/circle-user';

	let { children } = $props();

</script>

<div></div>
<div>
	<Navigation.Bar>
		<Navigation.Tile label="Home" href="/"></Navigation.Tile>
		<Navigation.Tile label="Device Table" href="/deviceTable"></Navigation.Tile>
		<Navigation.Tile label="Add Device" href="/addDevice"></Navigation.Tile>
	</Navigation.Bar>
</div>

{@render children()}
	