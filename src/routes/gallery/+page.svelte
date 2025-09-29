<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { FileExplorerImage, FullSizeImage, LeftBar, Window, WindowBody } from '$lib';

	let { data } = $props();

	let images = $derived(data.files.images.sort((a, b) => a.localeCompare(b)));
	let folders = $derived(data.files.folders.sort((a, b) => a.localeCompare(b)));
	let files = $derived([...images, ...folders].sort((a, b) => a.localeCompare(b)));

	let imageIndex = page.url.searchParams.get('imageIndex') || '-1';
	let selectedImage = $state(parseInt(imageIndex));

	function clearImage() {
		selectedImage = -1;
		clearParams();
	}

	function advanceImage() {
		if (selectedImage < images.length - 1) {
			selectedImage++;
			goToImage();
		}
	}

	function retreatImage() {
		if (selectedImage > 0) {
			selectedImage--;
			goToImage();
		}
	}

	function goToImage(imageIndex: number = selectedImage) {
		const params = page.url.searchParams;
		params.set('imageIndex', imageIndex.toString());
		const fullURL = `${page.url.pathname}?${params.toString()}`;
		goto(fullURL, { replaceState: true });
	}

	let modalContentRef = $state<HTMLDivElement | null>(null);

	function handelModalClick(event: MouseEvent) {
		if (modalContentRef && !modalContentRef.contains(event.target as Node)) {
			clearImage();
		}
	}

	async function handleFolderClick(folderName: string) {
		const currentLocation = page.url;
		const currentPath = currentLocation.searchParams.get('path') || '';

		const nextPath = `/gallery?path=${encodeURIComponent(`${currentPath}/${folderName}`)}`;

		await invalidateAll();

		// nav to new path
		await goto(nextPath);
	}

	function clearParams() {
		const params = page.url.searchParams;
		params.delete('imageIndex');
		const fullURL = `${page.url.pathname}?${params.toString()}`;
		goto(fullURL, { replaceState: true });
	}
</script>

<Window>
	<LeftBar />
	<!-- {#if data.isAdmin}
		<AdminGallery
			{files}
			{images}
			{folders}
			{path}
			handleFileClick={(file) => {
				selectedImage = images.indexOf(file);
			}}
			{handleFolderClick}
		/>
	{:else} -->
	<WindowBody title="Picture library" subtitle="Pictures">
		{#if files && files.length > 0}
			{#each files as file}
				{#if images.includes(file)}
					<FileExplorerImage
						src={file}
						name={decodeURIComponent(file).slice(file.lastIndexOf('/') + 2)}
						onClick={() => {
							const imageIndex = images.indexOf(file);
							selectedImage = imageIndex;
							goToImage(imageIndex);
						}}
					/>
				{:else if folders.includes(file)}
					<FileExplorerImage name={file} onClick={() => handleFolderClick(file)} />
				{/if}
			{/each}
		{/if}
	</WindowBody>
	<!-- {/if} -->
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
