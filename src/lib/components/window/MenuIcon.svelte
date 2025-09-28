<script lang="ts">
	const {
		src,
		alt = 'Menu Icon',
		label,
		className = '',
		href
	}: {
		src: string;
		alt?: string;
		label: string;
		className?: string;
		href?: string;
	} = $props();
</script>

{#if href}
	<a {href} class="flex flex-row gap-1 {className}">
		<img {src} {alt} class="h-4 w-4" />
		<span class="text-nowrap"> {label} </span>
	</a>
{:else}
	<div class="flex flex-row gap-1 {className}">
		<img {src} {alt} class="h-4 w-4" />
		<span class="text-nowrap"> {label} </span>
	</div>
{/if}

<style>
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
