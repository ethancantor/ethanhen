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
	style="position: fixed; top: 0; right: 0; left: 0; z-index: 10;"
	className="mx-auto"
	onCloseClick={clearImage}
	onMinimizeClick={clearImage}
	CustomMenuBar={FullSizeImageMenuBar}
	hasMenuBar
	hasTopBar={false}
	bodyDirection="column"
>
	<img class="h-full w-full object-contain p-16 {className}" {src} {alt} />
	<div class="flex h-fit w-full items-center justify-center bg-[#a8c8ea8e]">
		<PhotoControls onForwardClick={advanceImage} onBackClick={retreatImage} />
	</div>
</Window>
