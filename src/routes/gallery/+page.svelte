<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { FileExplorerImage, FullSizeImage, LeftBar, Window, WindowBody } from '$lib';
	import Console from '$lib/components/shared/Console.svelte';
	import { requestAdmin } from '$lib/utils/client/admin';
	import { apiFetch } from '$lib/utils/client/APIFetch';
	import { cookieFetch } from '$lib/utils/client/CookieFetch.svelte';
	import { isAdmin } from '$lib/utils/client/writables';

	let { data } = $props();

	let entries = $derived(data.files.entries);
	let images = $derived(entries.flatMap((entry) => (entry.type === 'image' ? [entry] : [])));
	let selectedIndex = $derived(
		images.findIndex((image) => image.id === page.url.searchParams.get('image'))
	);

	function imageName(url: string): string {
		return decodeURIComponent(url).slice(url.lastIndexOf('/') + 1);
	}

	function imagePathFromUrl(imageUrl: string): string {
		const marker = '/api/images/';
		const index = imageUrl.indexOf(marker);
		return decodeURIComponent(imageUrl.slice(index + marker.length));
	}

	function clearImage() {
		clearParams();
	}

	function advanceImage() {
		if (selectedIndex < images.length - 1) {
			goToImage(images[selectedIndex + 1].id);
		}
	}

	function retreatImage() {
		if (selectedIndex > 0) {
			goToImage(images[selectedIndex - 1].id);
		}
	}

	function goToImage(id: string) {
		const params = page.url.searchParams;
		params.delete('imageIndex');
		params.set('image', id);
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
		params.delete('image');
		const fullURL = `${page.url.pathname}?${params.toString()}`;
		goto(fullURL, { replaceState: true });
	}

	function folderRelativePath(name: string): string {
		const current = (page.url.searchParams.get('path') || '').replace(/^\/+|\/+$/g, '');
		return current ? `${current}/${name}` : name;
	}

	let pendingDelete = $state<{ relativePath: string; label: string } | null>(null);

	async function askDelete(relativePath: string, label: string) {
		if (!(await apiFetch.checkAdmin())) {
			isAdmin.set(false);
			requestAdmin(() => askDelete(relativePath, label));
			return;
		}

		pendingDelete = { relativePath, label };
	}

	async function performDelete(job = pendingDelete) {
		if (!job) {
			return;
		}

		pendingDelete = null;

		const response = await cookieFetch.fetchWithKey(
			`/api/images/${encodeURIComponent(job.relativePath)}`,
			{ method: 'DELETE' }
		);

		if (response.status === 401) {
			isAdmin.set(false);
			requestAdmin(() => performDelete(job));
			return;
		}

		if (!response.ok) {
			console.error('Failed to delete:', response.statusText);
			return;
		}

		if (selectedIndex !== -1 && imagePathFromUrl(images[selectedIndex].url) === job.relativePath) {
			clearImage();
		}

		await invalidateAll();
	}

	function onDeletePrompt(input: string) {
		const answer = input.trim().toLowerCase();
		if (answer === 'y' || answer === 'yes') {
			void performDelete();
			return;
		}

		pendingDelete = null;
	}
</script>

<Window>
	<LeftBar />
	<WindowBody title="Picture library" subtitle={$isAdmin ? 'Pictures (Admin)' : 'Pictures'}>
		{#if entries.length > 0}
			{#each entries as entry (entry.type === 'image' ? entry.id : entry.name)}
				{#if entry.type === 'image'}
					<FileExplorerImage
						src={entry.url}
						name={imageName(entry.url)}
						onDelete={$isAdmin ? () => askDelete(imagePathFromUrl(entry.url), imageName(entry.url)) : undefined}
						onClick={() => goToImage(entry.id)}
					/>
				{:else}
					<FileExplorerImage
						name={entry.name}
						onClick={() => handleFolderClick(entry.name)}
						onDelete={$isAdmin ? () => askDelete(folderRelativePath(entry.name), entry.name) : undefined}
					/>
				{/if}
			{/each}
		{:else if $isAdmin}
			<p class="text-sm text-gray-600">No pictures in this folder.</p>
		{/if}
	</WindowBody>
</Window>

{#if selectedIndex !== -1}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center"
		onclick={handelModalClick}
	>
		<div class="h-fit w-fit" bind:this={modalContentRef}>
			<FullSizeImage
				src={images[selectedIndex].url}
				alt="Full Size Image"
				className="max-h-[80vh] max-w-[90vw]"
				{clearImage}
				{advanceImage}
				{retreatImage}
				onDelete={$isAdmin
					? () =>
							askDelete(
								imagePathFromUrl(images[selectedIndex].url),
								imageName(images[selectedIndex].url)
							)
					: undefined}
			/>
		</div>
	</div>
{/if}

{#if pendingDelete}
	<Console
		prompt={`del ${pendingDelete.label}\nare you sure?\nthis will delete the file or folder permanently. (y/n): `}
		onEnter={onDeletePrompt}
		onClose={() => (pendingDelete = null)}
	/>
{/if}
