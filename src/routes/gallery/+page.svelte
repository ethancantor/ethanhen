<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { FileExplorerImage, FullSizeImage, LeftBar, Window, WindowBody } from '$lib';
	import { requestAdmin } from '$lib/utils/client/admin';
	import { apiFetch } from '$lib/utils/client/APIFetch';
	import { cookieFetch } from '$lib/utils/client/CookieFetch.svelte';
	import { isAdmin } from '$lib/utils/client/writables';

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

	function imagePathFromUrl(imageUrl: string): string {
		const marker = '/api/images/';
		const index = imageUrl.indexOf(marker);
		return decodeURIComponent(imageUrl.slice(index + marker.length));
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

	async function deleteImage(url: string) {
		if (!(await apiFetch.checkAdmin())) {
			isAdmin.set(false);
			requestAdmin(() => deleteImage(url));
			return;
		}

		if (!confirm(`Delete ${imageName(url)}?`)) {
			return;
		}

		const relativePath = imagePathFromUrl(url);
		const response = await cookieFetch.fetchWithKey(
			`/api/images/${encodeURIComponent(relativePath)}`,
			{ method: 'DELETE' }
		);

		if (response.status === 401) {
			isAdmin.set(false);
			requestAdmin(() => deleteImage(url));
			return;
		}

		if (!response.ok) {
			console.error('Failed to delete image:', response.statusText);
			return;
		}

		if (selectedImage !== -1) {
			clearImage();
		}

		await invalidateAll();
	}
</script>

<Window>
	<LeftBar />
	<WindowBody title="Picture library" subtitle={$isAdmin ? 'Pictures (Admin)' : 'Pictures'}>
		{#if entries.length > 0}
			{#each entries as entry (entry.type === 'image' ? entry.url : entry.name)}
				{#if entry.type === 'image'}
					<FileExplorerImage
						src={entry.url}
						name={imageName(entry.url)}
						onDelete={$isAdmin ? () => deleteImage(entry.url) : undefined}
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
		{:else if $isAdmin}
			<p class="text-sm text-gray-600">No pictures in this folder.</p>
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
				onDelete={$isAdmin ? () => deleteImage(images[selectedImage]) : undefined}
			/>
		</div>
	</div>
{/if}
