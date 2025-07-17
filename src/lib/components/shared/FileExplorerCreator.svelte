<script lang="ts">
	import { showFolder, showPassword } from '$lib/utils/client/writables';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import PasswordModal from '../uploads/PasswordModal.svelte';
	import { invalidateAll } from '$app/navigation';
	import { cookieFetch } from '$lib/utils/client/CookieFetch.svelte';
	import { apiFetch } from '$lib/utils/client/APIFetch';

	let text = $state('New Folder');
	let inputElement: HTMLInputElement | null = null;

	onMount(() => {
		if (inputElement) {
			inputElement.focus();
			inputElement.select();
		}
	});

	async function onSubmit() {
		const isAdmin = await apiFetch.checkAdmin();
		if (!isAdmin) {
			showPassword.set(true);
			return;
		}

		const dir = (page.url.searchParams.get('path') || '') + '/' + text;

		const response = await cookieFetch.fetchWithKey(`/api/upload/dir`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ dir })
		});

		if (response.ok) {
			showFolder.set(false);
			showPassword.set(false);
			text = 'New Folder';
			inputElement?.blur();
			await invalidateAll();
		}
	}
</script>

{#if $showPassword}
	<PasswordModal onSuccess={onSubmit} />
{/if}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex h-fit w-fit cursor-pointer flex-col items-center p-2" tabindex="0">
	<img
		src={'/windowsIcons/Standard Folders/imageres_3.ico'}
		alt={'new folder'}
		class="h-20 w-20 shrink-0 md:h-32 md:w-32"
		loading="lazy"
	/>
	<input
		class="w-fit max-w-20 text-center text-sm break-all"
		bind:value={text}
		bind:this={inputElement}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				onSubmit();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				onSubmit();
			}
		}}
	/>
</div>
