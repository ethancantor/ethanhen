<script>
	import Gallery from '$lib/components/Gallery.svelte';
	import GalleryImage from '$lib/components/GalleryImage.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { images } = data.props;
</script>

<svelte:head>
	<title>Image Gallery</title>
	<meta name="description" content="A dynamic image gallery built with SvelteKit." />
</svelte:head>

<div class="window active h-fit w-[90vw]">
	<div class="title-bar">
		<div class="title-bar-text">File Explorer</div>
		<div class="title-bar-controls">
			<button aria-label="Close"></button>
		</div>
	</div>
	<Gallery>
		{#if images && images.length > 0}
			{#each images as image, index}
				<GalleryImage src={image} alt={`Gallery image ${index + 1}`} />
			{/each}
		{:else}
			<p class="">No images found in the gallery.</p>
		{/if}
	</Gallery>
</div>
