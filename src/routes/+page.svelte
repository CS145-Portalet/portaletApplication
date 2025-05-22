<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase.js'
	import { authStore } from '../store/store.js';

	import Authenticate from '../lib/components/auth.svelte';

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.set({ user: user ?? null }); // Shorter and same logic
		});
		return unsubscribe;
	});
</script>

{#if $authStore.user}
  <p>Loading Device Menu</p>
  <p>Welcome to</p>
  <p>Cubimon</p>
{:else}
  <Authenticate />
{/if}
