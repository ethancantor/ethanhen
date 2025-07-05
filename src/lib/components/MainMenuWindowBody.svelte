<script>
	import MenuItem from './MenuItem.svelte';
</script>

<div class="flex h-full w-full flex-col p-2">
	<div class="flex h-fit w-full flex-row items-start justify-between border-b-1 border-gray-300">
		<div class="mb-2 flex flex-col">
			<span class="text-lg font-light text-[#077148]"> Documents library </span>
			<span>Includes: <span class="text-[#1672cc]"> 2 locations </span> </span>
		</div>
		<div class="flex h-10 flex-row items-center gap-2">
			<span>Arrange by:</span>
			<span class="text-[#1672cc]"> Folder </span>
			<span style="font-size:8px">▼</span>
		</div>
	</div>
	<div class="flex flex-row gap-8">
		<MenuItem label="gallery" href="/gallery" />
		<MenuItem label="upload" href="/upload" />
		<MenuItem label="awesome stuff" href="/awesome" />
	</div>
</div>
