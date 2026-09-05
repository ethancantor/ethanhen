<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { PasswordModal } from '$lib';
	import { onPasswordAccepted, refreshAdminStatus } from '$lib/utils/client/admin';
	import { showPassword } from '$lib/utils/client/writables';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		void refreshAdminStatus();
	});
</script>

{#if $showPassword}
	<PasswordModal onSuccess={onPasswordAccepted} />
{/if}

<div class="flex h-screen w-screen justify-center overflow-hidden pt-5">
	{@render children()}
</div>

<style global>
	* {
		font-family: var(--font);
	}

	:root {
		--font: 'SegOld', sans-serif;
	}
</style>
