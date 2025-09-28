<script lang="ts">
	import { FileExplorerImage, WindowBody } from '$lib';
	import { dndzone, type Item, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	let {
		files,
		images,
		folders,
		path,
		handleFileClick,
		handleFolderClick
	}: {
		files: string[];
		images: string[];
		folders: string[];
		path: string;
		handleFileClick: (file: string) => void;
		handleFolderClick: (folder: string) => void;
	} = $props();

	let items: Item[] = $derived(
		files.map((file) => ({
			id: file,
			data: { file }
		}))
	);

	function handleConsider(e: CustomEvent<DndEvent>) {
		// items = e.detail.items;
		// // console.log(items);
	}
</script>

admin
<WindowBody title="Picture library" subtitle="Pictures" className="h-full">
	<section
		use:dndzone={{ items, flipDurationMs: 300 }}
		onconsider={handleConsider}
		onfinalize={handleConsider}
		class="flex flex-row"
	>
		{#if folders && folders.length > 0}
			{#each folders as folder (folder)}
				<div class="h-fit w-fit" animate:flip={{ duration: 100 }}>
					<FileExplorerImage name={folder} onClick={() => handleFolderClick(folder)} />
				</div>
			{/each}
		{/if}
		{#if files && files.length > 0}
			{#each files as file}
				{#if images.includes(file)}
					<FileExplorerImage
						src={file}
						name={decodeURIComponent(file).replace(path, '').replaceAll('/', '')}
						onClick={(file) => handleFileClick(file)}
					/>
				{:else if folders.includes(file)}
					<FileExplorerImage name={file} onClick={() => handleFolderClick(file)} />
				{/if}
			{/each}
		{/if}
	</section>
</WindowBody>
