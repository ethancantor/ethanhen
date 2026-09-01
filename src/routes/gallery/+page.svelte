<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { FileExplorerImage, FullSizeImage, LeftBar, Window, WindowBody } from '$lib';

	let { data } = $props();

	let entries = $derived(data.files.entries);
	let images = $derived(
		entries.filter((entry) => entry.type === 'image').map((entry) => entry.url)
	);

	let imageIndex = page.url.searchParams.get('imageIndex') || '-1';
	let selectedImage = $state(parseInt(imageIndex));

	function imageName(url: string): string {
		return decodeURIComponent(url).slice(url.lastIndexOf('/') + 1);
	}

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
	<WindowBody title="Picture library" subtitle="Pictures">
		{#if entries.length > 0}
			{#each entries as entry (entry.type === 'image' ? entry.url : entry.name)}
				{#if entry.type === 'image'}
					<FileExplorerImage
						src={entry.url}
						name={imageName(entry.url)}
						onClick={() => {
							const index = images.indexOf(entry.url);
							selectedImage = index;
							goToImage(index);
						}}
					/>
				{:else}
					<FileExplorerImage name={entry.name} onClick={() => handleFolderClick(entry.name)} />
				{/if}
			{/each}
		{/if}
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
