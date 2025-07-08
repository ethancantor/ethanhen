<script lang="ts">
	let { topBarLocation }: { topBarLocation: string[] } = $props();
</script>

<div class="flex w-full flex-row items-center justify-start gap-2">
	<div class="me-1 flex flex-row gap-1">
		<img src="/nav_arrow.png" alt="logo" class="h-6 w-6" loading="eager" />
		<img src="/nav_arrow.png" alt="logo" class="h-6 w-6 scale-x-[-1]" loading="eager" />
		<img src="/nav_down_arrow.png" alt="down" class="my-auto h-2 w-3" loading="eager" />
	</div>
	<div class="flex w-full justify-between pt-2">
		<div class="window-body mt-5 flex h-6 w-full flex-row items-center justify-between">
			<div class="flex flex-row items-center justify-start gap-2 px-1">
				<img src="/windowsIcons/Shell32.dll/shell32_267.ico" alt="explorer icon" class="h-4 w-4" />
				{#each topBarLocation as location, index}
					<span class="text-xs">{location}</span>
					{#if index < topBarLocation.length - 1}
						<span style="font-size:8px">▶</span>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	<input type="search" placeholder="Search ethanhen" disabled />
</div>
