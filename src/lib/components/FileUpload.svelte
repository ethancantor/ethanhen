<script lang="ts">
	const NUMBER_OF_CHARACTERS_TO_SHOW = 10;

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
	<div class="flex h-full w-full flex-col">
		<form
			class="flex h-[calc(24rem-1rem)] w-full flex-row flex-wrap items-start justify-start space-x-3 overflow-y-scroll"
			ondrop={handleFileDrop}
			ondragover={(e) => e.preventDefault()}
		>
			{#each files as file}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex cursor-pointer flex-row items-center gap-2 p-2"
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
					<span class="text-sm text-black"
						>{file.name.split('.').slice(0, -1).join('').slice(0, NUMBER_OF_CHARACTERS_TO_SHOW) +
							'.' +
							file.name.split('.').pop()}</span
					>
				</div>
			{/each}
		</form>
		<button class="h-4">Upload {files.length} files</button>
	</div>
{:else}
	<form
		class="flex h-96 w-full cursor-pointer flex-row items-center justify-center p-2"
		ondrop={handleFileDrop}
		ondragover={(e) => e.preventDefault()}
	>
		<img
			src={'/windowsIcons/Standard Folders/imageres_3.ico'}
			alt={'upload files'}
			class="h-12 w-12"
			id={'upload files'}
		/>
		<label class="cursor-pointer text-center text-xs text-black" for={'upload files'}>
			drop files to upload
		</label>
	</form>
{/if}
