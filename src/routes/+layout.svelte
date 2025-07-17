<script lang="ts">
	import { fetchStore } from '$lib/utils/client/FetchStore.svelte';
	import '../app.css';
	import '../fonts.css';

	let { children } = $props();

	$effect.pre(() => {
		fetchStore.clearAPIKey();
	});
</script>

<div class="flex h-screen w-screen justify-center overflow-hidden pt-5">
	{@render children()}
</div>

<style global>
	* {
		font-family: var(--font);
	}

	:root {
		--font: 'SegOld', sans-serif;
	}
</style>
