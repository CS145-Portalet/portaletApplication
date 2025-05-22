<script>
	import { authHandlers } from '../../store/store.js';
</script>

<main class="flex flex-col items-center justify-center">
	<div class="mt-12">
		<h1 class="text-2xl font-bold text-white">Login</h1>
		<button on:click={authHandlers.loginWithGoogle} class="mt-12 rounded-lg bg-white p-4 font-bold">
			<i class="fa-brands fa-google fa-xl" style="color: #eb4d27;"></i>

			Sign In with Google</button
		>
	</div>
</main>
