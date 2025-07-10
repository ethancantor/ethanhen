<script lang="ts">
	import { getFolderToggleContext } from '$lib/utils/client/context';
	import { onMount } from 'svelte';

	let text = $state('New Folder');
	let inputElement: HTMLInputElement | null = null;

	onMount(() => {
		if (inputElement) {
			inputElement.focus();
			inputElement.select();
		}
	});

	const createFolderContext = getFolderToggleContext();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex h-fit w-fit cursor-pointer flex-col items-center" tabindex="0">
	<img
		src={'/windowsIcons/Standard Folders/imageres_3.ico'}
		alt={'new folder'}
		class="h-12"
		loading="lazy"
	/>
	<input
		class="w-fit max-w-20 text-center text-sm break-all"
		bind:value={text}
		bind:this={inputElement}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				createFolderContext.close();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				createFolderContext.close();
			}
		}}
	/>
</div>
