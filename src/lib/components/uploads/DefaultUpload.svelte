<script lang="ts">
	const { handleFileDrop }: { handleFileDrop: (event: DragEvent) => void } = $props();
</script>

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
