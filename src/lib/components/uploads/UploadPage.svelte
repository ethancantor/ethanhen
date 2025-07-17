<script lang="ts">
	import { page } from '$app/state';
	import { DefaultUpload, UploadWithFiles, PasswordModal } from '$lib';
	import { apiFetch } from '$lib/utils/client/APIFetch';
	import { cookieFetch } from '$lib/utils/client/CookieFetch.svelte';
	import { showPassword } from '$lib/utils/client/writables';

	let files: File[] = $state([]);
	let finishedPercent = $state(0);

	const searchParams = page.url.searchParams.get('path');

	async function handleFileDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.files) {
			files.push(...Array.from(event.dataTransfer.files));
		}

		handleFileUpload();
	}

	function removeFile(file: File) {
		files = files.filter((f) => f !== file);
	}

	async function handleFileUpload() {
		const isAdmin = await apiFetch.checkAdmin();
		if (!isAdmin) {
			showPassword.set(true);
			return;
		}

		finishedPercent = 0;
		const uploadPromises = files.map((file) =>
			cookieFetch.uploadFileWithKey(file, searchParams || '', (progress) => {
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
	<PasswordModal onSuccess={async () => handleFileUpload()} />
{/if}

{#if files.length > 0}
	<UploadWithFiles {handleFileDrop} {files} {removeFile} {finishedPercent} />
{:else}
	<DefaultUpload {handleFileDrop} />
{/if}
