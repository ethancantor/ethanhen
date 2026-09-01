<script lang="ts">
	const {
		onClick,
		onDelete,
		src,
		name
	}: {
		onClick?: (name: string) => void;
		onDelete?: () => void;
		src?: string;
		name?: string;
	} = $props();

	const folderIcon = '/windowsIcons/Standard Folders/imageres_3.ico';

	const source = $derived(() => {
		if (!src) {
			return folderIcon;
		}
		return src + '?scale=thumbnail';
	});

	function handleDeleteClick(event: MouseEvent) {
		event.stopPropagation();
		onDelete?.();
	}
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
		class="flex h-20 w-20 items-center justify-center md:h-32 md:w-32 {source() === folderIcon
			? 'p-2'
			: ''}"
	>
		<div class="image-frame">
			{#if onDelete}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span
					class="delete-btn"
					title="Delete {name}"
					aria-hidden="true"
					onclick={handleDeleteClick}
				>
					×
				</span>
			{/if}
			<img
				src={source()}
				alt={name}
				class="block max-h-20 max-w-20 object-contain md:max-h-32 md:max-w-32"
				loading="lazy"
				style="image-orientation: from-image;"
			/>
		</div>
	</div>

	{#if name}
		<div class="max-w-[10rem] text-center text-sm break-all text-black">
			{name}
		</div>
	{/if}
</div>

<style>
	.image-frame {
		position: relative;
		display: inline-block;
		line-height: 0;
	}

	.delete-btn {
		all: unset;
		position: absolute;
		top: 2px;
		right: 2px;
		z-index: 1;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		min-width: 16px;
		max-width: 16px;
		min-height: 16px;
		max-height: 16px;
		padding: 2px;
		border: 1px solid #707070;
		border-radius: 0;
		background: #ece9d8;
		color: #000;
		font-family: Tahoma, sans-serif;
		font-size: 10px;
		line-height: 1;
		cursor: pointer;
	}

	.delete-btn:hover {
		background: #fff;
	}
</style>
