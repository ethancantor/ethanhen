<script lang="ts">
	import { DefaultUpload, UploadWithFiles } from '$lib';

	let files: File[] = $state([]);

	function handleFileDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.files) {
			files.push(...Array.from(event.dataTransfer.files));
		}
	}

	function removeFile(file: File) {
		files = files.filter((f) => f !== file);
	}
</script>

{#if files.length > 0}
	<UploadWithFiles {handleFileDrop} {files} {removeFile} />
{:else}
	<DefaultUpload {handleFileDrop} />
{/if}
