<script lang="ts">
	import { MenuBar, MenuBarItem, PhotoControls, Window } from '$lib';
	import { onMount, onDestroy } from 'svelte';

	let {
		src,
		alt = 'Full Size Image',
		className = '',
		clearImage,
		advanceImage,
		retreatImage,
		onDelete
	}: {
		src: string;
		alt?: string;
		className?: string;
		clearImage: () => void;
		advanceImage: () => void;
		retreatImage: () => void;
		onDelete?: () => void;
	} = $props();

	function handleKeydown(event: KeyboardEvent) {
		event.preventDefault();
		if (event.key === 'Escape') {
			clearImage();
		} else if (event.key === 'ArrowRight') {
			advanceImage();
		} else if (event.key === 'ArrowLeft') {
			retreatImage();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#snippet FullSizeImageMenuBar()}
	<MenuBar hasIcons={false}>
		<MenuBarItem hasArrow>File</MenuBarItem>
		<MenuBarItem hasArrow>Print</MenuBarItem>
		<MenuBarItem>Email</MenuBarItem>
		<MenuBarItem hasArrow
			><a
				href="https://www.amazon.com/CD-Burner/s?k=CD+Burner"
				style="color:inherit;"
				target="_blank">Burn</a
			></MenuBarItem
		>
		<MenuBarItem hasArrow>Open</MenuBarItem>
		{#if onDelete}
			<MenuBarItem onClick={onDelete}>Delete</MenuBarItem>
		{/if}
	</MenuBar>
{/snippet}

<Window
	onCloseClick={clearImage}
	onMinimizeClick={clearImage}
	CustomMenuBar={FullSizeImageMenuBar}
	hasMenuBar
	hasTopBar={false}
	bodyDirection="column"
	hasMaxWidth={false}
	bodyStyle="margin:1;padding:0"
>
	<img
		class="block h-full w-full object-contain p-1 {className}"
		{src}
		{alt}
		style="image-orientation: from-image;"
	/>
	<div class="flex h-fit w-full items-center justify-center bg-[#a8c8ea8e]">
		<PhotoControls onForwardClick={advanceImage} onBackClick={retreatImage} />
	</div>
</Window>
