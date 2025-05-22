<script>
	import { authHandlers } from '../../store/store.js';
</script>

<main class="flex flex-col items-center justify-center">
	<div class="mt-12">
		<h1 class="text-2xl text-white font-bold">Login</h1>
		<button on:click={authHandlers.loginWithGoogle} class="p-4 bg-white rounded-lg mt-12 font-bold">
			<i class="fa-brands fa-google fa-xl" style="color: #eb4d27;"></i>

			Sign In with Google</button
		>
	</div>
</main>