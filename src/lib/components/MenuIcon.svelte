<script>
	export let src;
	export let alt = 'Menu Icon';
	export let label;
	export let className = '';
</script>

<div class="flex flex-row gap-1 {className}">
	<img {src} {alt} class="h-4 w-4" />
	<span class="text-nowrap"> {label} </span>
</div>
