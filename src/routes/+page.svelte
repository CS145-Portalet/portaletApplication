<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase.js';
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
	<main class="align-center flex flex-col items-center">
		<div class="mt-12 text-center">
			<p class="flex-row justify-center">Loading Device Menu</p>
			<p class="flex-row justify-center pt-10">Welcome to</p>
			<a class="text-tertiary-500 flex-row justify-center font-bold" href="/main"> Cubimon </a>
		</div>
	</main>
{:else}
	<Authenticate />
{/if}
