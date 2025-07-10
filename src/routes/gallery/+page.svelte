<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { FileExplorerImage, FullSizeImage, LeftBar, Window, WindowBody } from '$lib';

	let { data } = $props();

	let images = $derived(data.files.images.sort((a, b) => a.localeCompare(b)));
	let folders = $derived(data.files.folders.sort((a, b) => a.localeCompare(b)));
	let files = $derived([...images, ...folders].sort((a, b) => a.localeCompare(b)));

	let selectedImage = $state(-1);
	let path = $derived(page.url.searchParams.get('path') || '');

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

	async function handleFolderClick(folderName: string) {
		const currentLocation = page.url;
		const currentPath = currentLocation.searchParams.get('path') || '';

		const nextPath = `/gallery?path=${encodeURIComponent(`${currentPath}/${folderName}`)}`;

		await invalidateAll();

		// update state
		path = nextPath;

		// nav to new path
		await goto(nextPath);
	}

	let topBarLocation = $derived([
		'C:',
		'Users',
		'ethanhen',
		...decodeURIComponent(path.replace('/gallery?path=', '')).split('/').filter(Boolean)
	]);
</script>

<svelte:head>
	<title>Image Gallery</title>
	<meta name="description" content="A dynamic image gallery built with SvelteKit." />
</svelte:head>

<Window {topBarLocation}>
	<LeftBar />
	<WindowBody title="Picture library" subtitle="Pictures">
		<div class="grid max-h-[75vh] grid-cols-8 gap-3 overflow-y-auto p-4">
			{#if files && files.length > 0}
				{#each files as file, index}
					{#if images.includes(file)}
						<FileExplorerImage
							src={file}
							name={`Img ${index + 1}`}
							onClick={() => {
								selectedImage = index;
							}}
						/>
					{:else if folders.includes(file)}
						<FileExplorerImage name={file} onClick={() => handleFolderClick(file)} />
					{/if}
				{/each}
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
				src={files[selectedImage]}
				alt="Full Size Image"
				className="max-h-[80vh] max-w-[90vw]"
				{clearImage}
				{advanceImage}
				{retreatImage}
			/>
		</div>
	</div>
{/if}
