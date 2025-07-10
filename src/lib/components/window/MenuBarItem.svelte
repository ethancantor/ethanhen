<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		hasArrow = false,
		onClick
	}: { children?: Snippet; hasArrow?: boolean; onClick?: () => void } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<li role="menuitem" tabindex="0" class="flex flex-row items-center gap-2" onclick={onClick}>
	{#if children}
		{@render children()}
	{/if}
	{#if hasArrow}
		<div style="font-size:8px;">▼</div>
	{/if}
</li>
