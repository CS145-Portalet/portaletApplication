<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import type { User } from 'firebase/auth';
	import { auth } from '$lib/firebase.js'
	import { authStore, authHandlers } from '../store/store.js';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import { onMount } from 'svelte';
	let { children } = $props();



	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.set({ user: user ?? null }); // Shorter and same logic
		});
		return unsubscribe;
	});

	
	

</script>
	{#if $authStore.user}
<AppBar spaceY="align-middle" background="color-surface-50">
	{#snippet lead()}
		<a href="/main" class="hidden sm:block"> logo </a>
		<a href="/addDevice" type="button" class="bg-surface-200 rounded-full p-1">
			<CirclePlus />
		</a>
	{/snippet}

	{#snippet trail()}
		

		<div class="items-center space-x-2 hidden xl:inline-flex">
			<div class="flex flex-col">
				<p>
					Logged in as : <span class="text-purple-500 italic font-bold">
						{$authStore.user?.displayName}
					</span>
				</p>
				<p>{$authStore.user?.email}</p>
			</div>
			<button onclick={authHandlers.logout} class="bg-white p-2 rounded-full text-black">Log Out</button>
		</div>

	{/snippet}
</AppBar>
	{/if}
{@render children()}
