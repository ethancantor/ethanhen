<script lang="ts">
	import { FileExplorerImage, FullSizeImage, LeftBar, Window, WindowBody } from '$lib';

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

	let modalContentRef = $state<HTMLDivElement | null>(null);

	function handelModalClick(event: MouseEvent) {
		if (modalContentRef && !modalContentRef.contains(event.target as Node)) {
			clearImage();
		}
	}

	$effect(() => {
		if (modalContentRef) {
			console.log('Modal content reference is set:', modalContentRef);
		} else {
			console.log('Modal content reference is not set.');
		}
	});
</script>

<svelte:head>
	<title>Image Gallery</title>
	<meta name="description" content="A dynamic image gallery built with SvelteKit." />
</svelte:head>

<Window>
	<LeftBar />
	<WindowBody title="Picture library" subtitle="Pictures">
		<div class="grid grid-cols-8 gap-3 p-4">
			{#if images && images.length > 0}
				{#each images as image, index}
					<FileExplorerImage
						src={image}
						name={`Img ${index + 1}`}
						onClick={() => {
							selectedImage = index;
						}}
					/>
				{/each}
			{:else}
				<p class="">No images found in the gallery.</p>
			{/if}
		</div>
	</WindowBody>
</Window>

{#if selectedImage !== -1}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center"
		onclick={handelModalClick}
	>
		<div class="h-fit w-fit" bind:this={modalContentRef}>
			<FullSizeImage
				src={images[selectedImage]}
				alt="Full Size Image"
				className="max-h-[80vh] max-w-[90vw]"
				{clearImage}
				{advanceImage}
				{retreatImage}
			/>
		</div>
	</div>
{/if}
