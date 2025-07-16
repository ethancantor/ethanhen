<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import '../fonts.css';

	let { children } = $props();
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
