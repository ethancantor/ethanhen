<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { fetchStore } from '$lib/utils/client/FetchStore.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
		console.log('Layout mounted');
		fetchStore.clearAPIKey();
	});

	// Additional debug logging
	console.log('Layout script running, browser:', browser);
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
