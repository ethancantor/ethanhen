<script lang="ts">
	const {
		src,
		alt = 'Menu Icon',
		label,
		className = ''
	}: { src: string; alt?: string; label: string; className?: string } = $props();
</script>

<div class="flex flex-row gap-1 {className}">
	<img {src} {alt} class="h-4 w-4" />
	<span class="text-nowrap"> {label} </span>
</div>
