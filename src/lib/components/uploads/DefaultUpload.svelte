<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { WindowBody } from '$lib';
	import FileExplorerImage from '../shared/FileExplorerImage.svelte';
	import CreateFolderModal from './CreateFolderModal.svelte';

	const { handleFileDrop }: { handleFileDrop: (event: DragEvent) => void } = $props();
	const { folders } = $derived(page.data);

	let showCreateFolderModal = $state(false);

	async function handleFolderClick(folderName: string) {
		const currentLocation = page.url;
		const currentPath = currentLocation.searchParams.get('path') || '';

		const nextPath = `/upload?path=${encodeURIComponent(`${currentPath}/${folderName}`)}`;
		await invalidateAll();
		// nav to new path
		await goto(nextPath);
	}

	function closeModal() {
		showCreateFolderModal = false;
	}
</script>

{#snippet CreateFolder()}
	<button onclick={() => (showCreateFolderModal = true)}>New Folder</button>
{/snippet}

{#if showCreateFolderModal}
	<CreateFolderModal {closeModal} />
{/if}

<form
	class="h-96 w-full cursor-pointer"
	ondrop={handleFileDrop}
	ondragover={(e) => e.preventDefault()}
>
	<WindowBody title="Drop Files to Upload" subtitle={CreateFolder}>
		{#each folders as folder}
			<FileExplorerImage name={folder} onClick={() => handleFolderClick(folder)} />
		{/each}
	</WindowBody>
</form>
