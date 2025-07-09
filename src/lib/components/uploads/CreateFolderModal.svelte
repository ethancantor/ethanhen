<script lang="ts">
	import { Window } from '$lib';

	let { closeModal }: { closeModal: () => void } = $props();
	let folderName: string = $state('');
	let password: string = $state('');
</script>

<div class="fixed inset-0 top-[30%] left-[50%] h-fit w-fit translate-x-[-50%]">
	<Window
		bodyStyle="padding-right: 1rem; padding-left: 1rem; padding-top: 0.25rem; padding-bottom: 0.25rem; gap: 2px;"
		bodyDirection="column"
		hasTopBar={false}
		hasMenuBar={false}
		onCloseClick={closeModal}
		onMinimizeClick={closeModal}
	>
		<h4>Create a New Folder</h4>
		<input type="text" bind:value={folderName} placeholder="Folder Name" />
		<input type="password" placeholder="Password" bind:value={password} />
		<button>Create Folder</button>
	</Window>
</div>
