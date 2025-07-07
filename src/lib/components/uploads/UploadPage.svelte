<script lang="ts">
	import { DefaultUpload, UploadWithFiles } from '$lib';
	import { handleUploadClick } from './UploadFunction';

	let files: File[] = $state([]);
	let finishedPercent = $state(0);

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
			handleUploadClick(file, (progress) => {
				console.log(finishedPercent);
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
