<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { DefaultUpload, UploadWithFiles } from '$lib';
	import { fetchStore } from '$lib/utils/client/FetchStore.svelte';
	import { showPassword } from '$lib/utils/client/writables';
	import PasswordModal from './PasswordModal.svelte';

	let files: File[] = $state([]);
	let finishedPercent = $state(0);

	const searchParams = page.url.searchParams.get('path');

	function handleFileDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.files) {
			files.push(...Array.from(event.dataTransfer.files));
		}

		if (!page.data.isAdmin) {
			showPassword.set(true);
		} else {
			handleFileUpload();
		}
	}

	function removeFile(file: File) {
		files = files.filter((f) => f !== file);
	}

	function handleFileUpload() {
		finishedPercent = 0;
		const uploadPromises = files.map((file) =>
			fetchStore.uploadFileWithKey(file, searchParams || '', (progress) => {
				finishedPercent += Math.round(progress / (files.length - 1));
			})
		);
		Promise.all(uploadPromises)
			.then(() => {
				files = [];
				finishedPercent = 100;
				console.log('Files uploaded successfully');
			})
			.catch((error) => {
				console.error('Error uploading files:', error);
			});
	}
</script>

{#if $showPassword}
	<PasswordModal
		onSuccess={async () => {
			invalidateAll();
			console.log('Password accepted, proceeding with upload');
			handleFileUpload();
		}}
	/>
{/if}

{#if files.length > 0}
	<UploadWithFiles {handleFileDrop} {files} {removeFile} {finishedPercent} />
{:else}
	<DefaultUpload {handleFileDrop} />
{/if}
