<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, hasArrow = false }: { children?: Snippet; hasArrow?: boolean } = $props();
</script>

<li role="menuitem" tabindex="0" class="flex flex-row items-center gap-2">
	{#if children}
		{@render children()}
	{/if}
	{#if hasArrow}
		<div style="font-size:8px;">▼</div>
	{/if}
</li>
