<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import type { User } from 'firebase/auth';
	import { auth } from '$lib/firebase.js';
	import { authStore, authHandlers } from '../store/store.js';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { goto } from '$app/navigation';

	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import UserIcon from '@lucide/svelte/icons/circle-user';
	import IconX from '@lucide/svelte/icons/x';
	import Menu from '@lucide/svelte/icons/menu';

	import logo from '$lib/assets/CubimonLogo.png';
	import text from '$lib/assets/CubimonText.png';

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

	let drawerState = $state(false);

  	function drawerClose() {
    	drawerState = false;
	}

	function goMainPage(){
		goto('/main');
		drawerClose();

	}
	function goAddDevice(){
		goto('/addDevice');
		drawerClose();
	}
</script>

{#if $authStore.user}
	<AppBar spaceY="align-middle" background="color-surface-50">
		{#snippet lead()}
			<a href="/main" class="hidden sm:block">
				<div class="align-center flex">
					<img alt="Logo" src={logo} width="52" height="40" />
					<img alt="Cubimon" src={text} width="127" height="35" />
				</div>
			</a>

			<Modal
				open={drawerState}
				onOpenChange={(e) => (drawerState = e.open)}
				triggerBase="bg-surface-200 block rounded-full p-1 sm:hidden"
				contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
				positionerJustify="justify-start"
				positionerAlign=""
				positionerPadding=""
				transitionsPositionerIn={{ x: -480, duration: 200 }}
				transitionsPositionerOut={{ x: -480, duration: 200 }}
			>
				{#snippet trigger()}
					<Menu />
				{/snippet}
				{#snippet content()}
					<header class="flex justify-between">
					<h2 class="h2">Menu</h2>
					</header>
					<article class="flex flex-col gap-2">
						<button class="text-tertiary-500 ml-5" onclick={goMainPage}>
							Home Page
						</button>
						<button class="text-tertiary-500 ml-5" onclick={goAddDevice}>
							Add Device
						</button>
						
					
					</article>
				{/snippet}
			</Modal>


		{/snippet}

		{#snippet trail()}
			<div class="align-center">
				<a href="/addDevice" type="button" class="bg-surface-200 hidden rounded-full p-1 sm:block">
					<CirclePlus />
				</a>
			</div>

			<Popover
				open={openState}
				onOpenChange={(e) => (openState = e.open)}
				positioning={{ placement: 'bottom-end' }}
				triggerBase="bg-surface-200 p-1 rounded-full block"
				contentBase="card bg-surface-200-800 p-5 space-y-4 max-w-[320px]"
				arrow
				arrowBackground="!bg-surface-200 dark:!bg-surface-800"
			>
				{#snippet trigger()}<UserIcon />{/snippet}

				{#snippet content()}
					<header class="flex justify-between">
						<p class="text-xl font-bold">User Info</p>

						<button class="btn-icon hover:preset-tonal" onclick={popoverClose}>
							<IconX />
						</button>
					</header>

					<article class="flex flex-col justify-center">
						<p>Logged in as :</p>
						<p class="text-tertiary-500 font-bold italic">
							{$authStore.user?.displayName}
						</p>
						<p class="text-tertiary-500 italic">
							{$authStore.user?.email}
						</p>
					</article>
					<div class="flex flex-row items-center justify-center">
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
