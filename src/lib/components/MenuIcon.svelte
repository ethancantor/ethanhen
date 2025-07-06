<script lang="ts">
	export let src: string;
	export let alt: string = 'Menu Icon';
	export let label: string;
	export let className: string = '';
</script>

<div class="flex flex-row gap-1 {className}">
	<img {src} {alt} class="h-4 w-4" />
	<span class="text-nowrap"> {label} </span>
</div>
