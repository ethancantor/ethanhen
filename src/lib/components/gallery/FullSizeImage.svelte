<script lang="ts">
	import { MenuBar, MenuBarItem, PhotoControls, Window } from '$lib';

	let {
		src,
		alt = 'Full Size Image',
		className = '',
		clearImage,
		advanceImage,
		retreatImage
	}: {
		src: string;
		alt?: string;
		className?: string;
		clearImage: () => void;
		advanceImage: () => void;
		retreatImage: () => void;
	} = $props();

	window.addEventListener('keydown', (event) => {
		event.preventDefault();
		if (event.key === 'Escape') {
			clearImage();
		} else if (event.key === 'ArrowRight') {
			advanceImage();
		} else if (event.key === 'ArrowLeft') {
			retreatImage();
		}
	});
</script>

{#snippet FullSizeImageMenuBar()}
	<MenuBar hasIcons={false}>
		<MenuBarItem hasArrow>File</MenuBarItem>
		<MenuBarItem hasArrow>Print</MenuBarItem>
		<MenuBarItem>Email</MenuBarItem>
		<MenuBarItem hasArrow
			><a href="https://www.amazon.com/CD-Burner/s?k=CD+Burner" style="color:inherit;">Burn</a
			></MenuBarItem
		>
		<MenuBarItem hasArrow>Open</MenuBarItem>
	</MenuBar>
{/snippet}

<Window
	onCloseClick={clearImage}
	onMinimizeClick={clearImage}
	CustomMenuBar={FullSizeImageMenuBar}
	hasMenuBar
	hasTopBar={false}
	bodyDirection="column"
>
	<img class="h-full w-full object-contain p-4 md:p-16 {className}" {src} {alt} />
	<div class="flex h-fit w-full items-center justify-center bg-[#a8c8ea8e]">
		<PhotoControls onForwardClick={advanceImage} onBackClick={retreatImage} />
	</div>
</Window>
