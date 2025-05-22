<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import type { User } from 'firebase/auth';
	import { auth } from '$lib/firebase.js';
	import { authStore, authHandlers } from '../store/store.js';
	import { Popover } from '@skeletonlabs/skeleton-svelte';

	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import UserIcon from '@lucide/svelte/icons/user';
	import IconX from '@lucide/svelte/icons/x';

	import logo from '$lib/assets/CubimonLogo.png';
	import text from '$lib/assets/CubimonText.png'

	import { onMount } from 'svelte';
	import { page } from '$app/state';
	let { children } = $props();

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.set({ user: user ?? null }); // Shorter and same logic
		});
		return unsubscribe;
	});

  	let openState = $state(false);

  	function popoverClose() {
    	openState = false;
	}
</script>



{#if $authStore.user}
	<AppBar spaceY="align-middle" background="color-surface-50">
		{#snippet lead()}
			<a href="/main" class="hidden sm:block"> 
				<div class="flex align-center">
					<img alt="Logo" src={logo} width="52" height="40"/>
					<img alt="Cubimon" src={text} width="127" height="35"/>
				</div>
			</a>
		{/snippet}

		{#snippet trail()}
			<div class ="align-center">
				<a href="/addDevice" type="button" class="bg-surface-200 rounded-full p-1 hidden sm:block">
					<CirclePlus />
				</a>
			</div>

			<Popover
				open={openState}
				onOpenChange={(e) => (openState = e.open)}
				positioning={{ placement: 'bottom-end' }}
				triggerBase="bg-surface-200 p-1 rounded-full block hidden sm:block"
				contentBase="card bg-surface-200-800 p-5 space-y-4 max-w-[320px]"
				arrow
				arrowBackground="!bg-surface-200 dark:!bg-surface-800"
			>
				{#snippet trigger()}<UserIcon />{/snippet}

				{#snippet content()}
					<header class="flex justify-between">
						<p class="font-bold text-xl">User Info</p>

						<button class="btn-icon hover:preset-tonal" onclick={popoverClose}>
							<IconX />
						</button>
					</header>

					<article class="flex flex-col justify-center">
						<p>Logged in as : </p>
						<p class="font-bold text-tertiary-500 italic">
							{$authStore.user?.displayName}
						</p>
						<p class="text-tertiary-500 italic">
							{$authStore.user?.email}
						</p>
					</article>
					<div class = "flex flex-row items-center justify-center">
						<button onclick={authHandlers.logout} class="rounded-full bg-white p-2 px-3 text-black">
							Log Out
						</button>
					</div>
				{/snippet}
			</Popover>

		{/snippet}
	</AppBar>
{/if}
{@render children()}
