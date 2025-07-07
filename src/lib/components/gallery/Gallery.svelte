<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="window-body has-space flex h-full max-h-[80vh] flex-row flex-wrap gap-2 overflow-y-auto"
>
	{@render children()}
</div>
