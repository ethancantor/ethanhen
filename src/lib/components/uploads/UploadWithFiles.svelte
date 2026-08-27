<script lang="ts">
	import { FileExplorerImage } from '$lib';
	import type { UploadItem } from '$lib/types/upload';

	const {
		handleFileDrop,
		uploadItems,
		removeFile
	}: {
		handleFileDrop: (event: DragEvent) => void;
		uploadItems: UploadItem[];
		removeFile: (item: UploadItem) => void;
	} = $props();

	const finishedPercent = $derived.by(() => {
		if (uploadItems.length === 0) {
			return 0;
		}

		const total = uploadItems.reduce((sum, item) => sum + item.progress, 0);
		return Math.round(total / uploadItems.length);
	});

	const hasError = $derived(uploadItems.some((item) => item.status === 'error'));
	const isComplete = $derived(
		uploadItems.length > 0 && uploadItems.every((item) => item.status === 'done')
	);
	const isUploading = $derived(uploadItems.some((item) => item.status === 'uploading'));

	const statusLabel = $derived.by(() => {
		if (hasError) {
			return 'Upload failed';
		}
		if (isComplete) {
			return 'Upload complete';
		}
		if (isUploading) {
			return 'Uploading...';
		}
		return '';
	});

	function fileIcon(file: File): string {
		if (file.type.startsWith('image/')) {
			return URL.createObjectURL(file);
		}
		return '/windowsIcons/Libraries/imageres_1002.ico';
	}
</script>

<div class="flex h-full w-full flex-col">
	<form
		class="grid h-[calc(24rem-1rem)] grid-cols-7 content-start gap-3 overflow-y-scroll p-4"
		ondrop={handleFileDrop}
		ondragover={(e) => e.preventDefault()}
	>
		{#each uploadItems as item (item.id)}
			<FileExplorerImage
				src={fileIcon(item.file)}
				name={item.file.name}
				onClick={() => removeFile(item)}
			/>
		{/each}
	</form>
	<div class="upload-progress px-4 pb-4">
		{#if statusLabel}
			<p class="upload-progress-label">{statusLabel}</p>
		{/if}
		<div
			class="progress-track"
			role="progressbar"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow={finishedPercent}
			aria-label={statusLabel || 'Upload progress'}
		>
			<div class="progress-fill" class:error={hasError} style="width: {finishedPercent}%"></div>
		</div>
	</div>
</div>

<style>
	.upload-progress-label {
		margin: 0 0 4px;
		font-size: 12px;
		color: #000;
	}

	.progress-track {
		height: 18px;
		border: 1px solid #8e8f8f;
		background: linear-gradient(to bottom, #f3f3f3 0%, #ffffff 100%);
		box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.15);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(
			to bottom,
			#b9f6a0 0%,
			#7ad84a 25%,
			#4ea52a 50%,
			#3d8a22 75%,
			#6bc44b 100%
		);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
		transition: width 0.15s ease-out;
	}

	.progress-fill.error {
		background: linear-gradient(
			to bottom,
			#f5a0a0 0%,
			#e06060 25%,
			#c04040 50%,
			#a03030 75%,
			#d07070 100%
		);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
	}
</style>
