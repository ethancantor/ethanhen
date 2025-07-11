<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { WindowBody } from '$lib';
	import { showFolder } from '$lib/utils/client/writables';
	import FileExplorerCreator from '../shared/FileExplorerCreator.svelte';
	import FileExplorerImage from '../shared/FileExplorerImage.svelte';

	const { handleFileDrop }: { handleFileDrop: (event: DragEvent) => void } = $props();
	const { folders } = $derived(page.data);

	async function handleFolderClick(folderName: string) {
		const currentLocation = page.url;
		const currentPath = currentLocation.searchParams.get('path') || '';

		const nextPath = `/upload?path=${encodeURIComponent(`${currentPath}/${folderName}`)}`;
		await invalidateAll();
		// nav to new path
		await goto(nextPath);
	}
</script>

<form
	class="h-96 w-full cursor-pointer"
	ondrop={handleFileDrop}
	ondragover={(e) => e.preventDefault()}
>
	<WindowBody title="Drop Files to Upload" subtitle="Create folder above" className="pt-2">
		{#if $showFolder}
			<FileExplorerCreator />
		{/if}
		{#each folders as folder}
			<FileExplorerImage name={folder} onClick={() => handleFolderClick(folder)} />
		{/each}
	</WindowBody>
</form>
