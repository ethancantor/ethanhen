<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { Window } from '$lib';
	import { fetchWithKey } from '$lib/utils/client/fetch';

	let { closeModal }: { closeModal: () => void } = $props();
	let folderName: string = $state('');
	let password: string = $state('');

	let error: string = $state('');

	const searchParams = page.url.searchParams.get('path');

	async function handleCreateFolder() {
		if (!folderName) {
			return;
		}

		const response = await fetchWithKey('/api/upload/dir', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				dir: `${searchParams ? searchParams + '/' : ''}${folderName}`,
				password
			})
		});

		if (response.ok) {
			closeModal();
			invalidateAll();
		} else {
			const errorData = await response.json();
			console.error('Error creating folder:', errorData);
			error = errorData.message || 'Failed to create folder';
		}
	}
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
		<button onclick={handleCreateFolder}>Create Folder</button>
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
	</Window>
</div>
