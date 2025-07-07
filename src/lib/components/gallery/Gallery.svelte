<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, onClick }: { children: Snippet; onClick?: () => void } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="window-body has-space flex h-full max-h-[80vh] flex-row flex-wrap gap-2 overflow-y-auto"
	onclick={onClick}
>
	{@render children()}
</div>
