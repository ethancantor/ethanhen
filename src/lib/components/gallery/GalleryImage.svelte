<script lang="ts">
	const {
		src,
		alt = 'Image',
		loading = 'lazy',
		className = 'max-w-[300px]',
		onClick
	}: {
		src: string;
		alt?: string;
		loading?: 'lazy' | 'eager';
		className?: string;
		onClick?: () => void;
	} = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="h-fit w-fit" onclick={onClick}>
	<img {src} {alt} {loading} class={className} />
</div>
