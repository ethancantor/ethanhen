<script lang="ts">
	const {
		src,
		alt = 'Image',
		loading = 'lazy',
		className = 'max-w-[300px]'
	}: {
		src: string;
		alt?: string;
		loading?: 'lazy' | 'eager';
		className?: string;
	} = $props();
</script>

<div class="h-fit w-fit">
	<img {src} {alt} {loading} class={className} />
</div>
