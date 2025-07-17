<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { fetchStore } from '$lib/utils/client/FetchStore.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
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
