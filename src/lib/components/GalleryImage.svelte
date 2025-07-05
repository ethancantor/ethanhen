<script lang="ts">
	export let src: string;
	export let alt: string = 'Image';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let className: string = 'max-w-[300px]';
</script>

<div class="h-fit w-fit">
	<img {src} {alt} {loading} class={className} />
</div>
