<script lang="ts">
	import { FullSizeImage, Gallery, GalleryImage } from '$lib';

	const { data } = $props();

	const images: string[] = data.images;

	let selectedImage = $state(-1);

	function clearImage() {
		selectedImage = -1;
	}

	function advanceImage() {
		if (selectedImage < images.length - 1) {
			selectedImage++;
		}
	}

	function retreatImage() {
		if (selectedImage > 0) {
			selectedImage--;
		}
	}
</script>

<svelte:head>
	<title>Image Gallery</title>
	<meta name="description" content="A dynamic image gallery built with SvelteKit." />
</svelte:head>

<div class="window active h-fit w-[90vw]">
	<div class="title-bar">
		<div class="title-bar-text">
			{selectedImage || 'File Explorer'}
		</div>
		<div class="title-bar-controls">
			<button aria-label="Close"></button>
		</div>
	</div>
	<Gallery>
		{#if images && images.length > 0}
			{#each images as image, index}
				<GalleryImage
					src={image}
					alt={`Gallery image ${index + 1}`}
					onClick={() => {
						selectedImage = index;
					}}
				/>
			{/each}
		{:else}
			<p class="">No images found in the gallery.</p>
		{/if}
	</Gallery>
</div>

{#if selectedImage !== -1}
	<FullSizeImage
		src={images[selectedImage]}
		alt="Full Size Image"
		className="max-h-[80vh] max-w-[90vw]"
		{clearImage}
		{advanceImage}
		{retreatImage}
	/>
{/if}
