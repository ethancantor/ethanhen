<script lang="ts">
	import { page } from '$app/state';
	import { DefaultUpload, UploadWithFiles } from '$lib';
	import { uploadFile } from '$lib/utils/upload-funcs';

	let files: File[] = $state([]);
	let finishedPercent = $state(0);

	const searchParams = page.url.searchParams.get('path');

	function handleFileDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.files) {
			files.push(...Array.from(event.dataTransfer.files));
		}
	}

	function removeFile(file: File) {
		files = files.filter((f) => f !== file);
	}

	function handleFileUpload() {
		finishedPercent = 0;
		const uploadPromises = files.map((file) =>
			uploadFile(file, searchParams || '', (progress) => {
				finishedPercent += Math.round(progress / (files.length - 1));
			})
		);
		Promise.all(uploadPromises);
	}
</script>

{#if files.length > 0}
	<UploadWithFiles
		{handleFileDrop}
		{files}
		{removeFile}
		handleUploadClick={handleFileUpload}
		{finishedPercent}
	/>
{:else}
	<DefaultUpload {handleFileDrop} />
{/if}
