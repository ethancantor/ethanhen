<script lang="ts">
	import { FileExplorerImage } from '$lib';

	const {
		handleFileDrop,
		files,
		removeFile,
		finishedPercent
	}: {
		handleFileDrop: (event: DragEvent) => void;
		files: File[];
		removeFile: (file: File) => void;
		finishedPercent: number;
	} = $props();
</script>

<div class="flex h-full w-full flex-col">
	<form
		class="grid h-[calc(24rem-1rem)] grid-cols-7 content-start gap-3 overflow-y-scroll p-4"
		ondrop={handleFileDrop}
		ondragover={(e) => e.preventDefault()}
	>
		{#each files as file}
			<FileExplorerImage
				src={file.type.startsWith('image/')
					? URL.createObjectURL(file)
					: '/windowsIcons/Libraries/imageres_1002.ico'}
				name={file.name}
				onClick={() => removeFile(file)}
			/>
		{/each}
	</form>
	<div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="80">
		<div style="width: {finishedPercent}%"></div>
	</div>
	<!-- <button class="h-4" onclick={handleUploadClick}>Upload {files.length} files</button> -->
</div>
