<script lang="ts">
	const NUMBER_OF_CHARACTERS_TO_SHOW = 10;

	const {
		handleFileDrop,
		files,
		removeFile
	}: {
		handleFileDrop: (event: DragEvent) => void;
		files: File[];
		removeFile: (file: File) => void;
	} = $props();
</script>

<div class="flex h-full w-full flex-col">
	<form
		class="grid h-[calc(24rem-1rem)] grid-cols-7 content-start gap-3 overflow-y-scroll p-4"
		ondrop={handleFileDrop}
		ondragover={(e) => e.preventDefault()}
	>
		{#each files as file}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex h-fit w-fit cursor-pointer flex-col items-center"
				onclick={() => removeFile(file)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						removeFile(file);
					}
				}}
			>
				<img
					src={file.type.startsWith('image/')
						? URL.createObjectURL(file)
						: '/windowsIcons/Libraries/imageres_1002.ico'}
					alt={file.name}
					class="h-12"
				/>
				<div class="max-w-[10rem] text-center text-sm break-all text-black">
					<!-- {file.name} -->
					{file.name.split('.').slice(0, -1).join('').slice(0, NUMBER_OF_CHARACTERS_TO_SHOW) +
						'.' +
						file.name.split('.').pop()}
				</div>
			</div>
		{/each}
	</form>
	<button class="h-4">Upload {files.length} files</button>
</div>
