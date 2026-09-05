<script lang="ts">
	import { page } from '$app/state';
	import { DefaultUpload, UploadWithFiles } from '$lib';
	import type { UploadItem } from '$lib/types/upload';
	import { requestAdmin } from '$lib/utils/client/admin';
	import { apiFetch } from '$lib/utils/client/APIFetch';
	import { cookieFetch } from '$lib/utils/client/CookieFetch.svelte';

	let uploadItems: UploadItem[] = $state([]);

	const uploadPath = page.url.searchParams.get('path') ?? '';

	async function handleFileDrop(event: DragEvent) {
		event.preventDefault();

		for (const file of event.dataTransfer?.files ?? []) {
			uploadItems.push({
				id: crypto.randomUUID(),
				file,
				progress: 0,
				status: 'pending'
			});
		}

		handleFileUpload();
	}

	function removeFile(item: UploadItem) {
		uploadItems = uploadItems.filter((uploadItem) => uploadItem.id !== item.id);
	}

	async function uploadItem(item: UploadItem) {
		item.status = 'uploading';

		try {
			await cookieFetch.uploadFileWithKey(item.file, uploadPath, (progress) => {
				item.progress = progress;
			});
			item.progress = 100;
			item.status = 'done';
		} catch (error) {
			item.status = 'error';
			console.error(`Error uploading ${item.file.name}:`, error);
		}
	}

	async function handleFileUpload() {
		const isAdmin = await apiFetch.checkAdmin();
		if (!isAdmin) {
			requestAdmin(handleFileUpload);
			return;
		}

		const pendingItems = uploadItems.filter((item) => item.status === 'pending');
		await Promise.allSettled(pendingItems.map(uploadItem));
	}
</script>

{#if uploadItems.length > 0}
	<UploadWithFiles {handleFileDrop} {uploadItems} {removeFile} />
{:else}
	<DefaultUpload {handleFileDrop} />
{/if}
