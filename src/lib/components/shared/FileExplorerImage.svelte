<script lang="ts">
	const { onClick, src, name }: { onClick?: (name: string) => void; src?: string; name?: string } =
		$props();

	const folderIcon = '/windowsIcons/Standard Folders/imageres_3.ico';

	const source = $derived(() => {
		if (!src) {
			return folderIcon;
		}
		return src + '?scale=thumbnail';
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="mt-auto flex h-fit w-fit cursor-pointer flex-col items-center justify-end gap-0"
	tabindex="0"
	onclick={() => onClick?.(name || 'File')}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onClick?.(name || 'File');
		}
	}}
>
	<div
		class="flex h-20 w-20 items-end justify-center md:h-32 md:w-32 {source() === folderIcon
			? 'p-2'
			: ''}"
	>
		<img
			src={source()}
			alt={name}
			class="h-auto max-h-full w-full object-contain"
			loading="lazy"
			style="image-orientation: from-image;"
		/>
	</div>

	{#if name}
		<div class="max-w-[10rem] text-center text-sm break-all text-black">
			{name}
		</div>
	{/if}
</div>
