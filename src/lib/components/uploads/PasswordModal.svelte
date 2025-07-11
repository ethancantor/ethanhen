<script lang="ts">
	import { showFolder, showPassword } from '$lib/utils/client/writables';
	import { onMount } from 'svelte';
	import Window from '../window/Window.svelte';

	let { onSuccess }: { onSuccess: (password: string) => Promise<void> } = $props();

	let passwordInput = $state('');
	let error = $state<string | null>(null);

	let divElement: HTMLDivElement | null = null;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handlePasswordSubmit();
		} else if (event.key === 'Backspace') {
			passwordInput = passwordInput.slice(0, -1);
		} else if (event.key.length === 1) {
			passwordInput += event.key;
		}
	}

	async function handlePasswordSubmit() {
		const response = await fetch(`/api/password?password=${encodeURIComponent(passwordInput)}`, {
			method: 'GET'
		});
		if (response.ok) {
			await onSuccess(passwordInput);
			console.log('Password accepted');
			error = null;
			showPassword.set(false);
		} else {
			error = 'incorrect password. click this message to see the hint and try again.';
			passwordInput = '';
			return false;
		}
	}

	onMount(() => {
		if (divElement) {
			divElement.focus();
			divElement.addEventListener('keydown', handleKeyDown);
		}
	});

	function onClose() {
		showPassword.set(false);
		showFolder.set(false);
		error = null;
		passwordInput = '';
		if (divElement) {
			divElement.removeEventListener('keydown', handleKeyDown);
		}
	}
</script>

<div class="fixed inset-0 top-[30%] left-[50%] h-fit w-fit translate-x-[-50%]">
	<Window
		hasMenuBar={false}
		hasTopBar={false}
		title="C:\Windows\System32\cmd.exe"
		titleIcon="/windowsIcons/Default Programs/cmd_IDI_APPICON.ico"
		onCloseClick={onClose}
		onMinimizeClick={onClose}
	>
		<div
			class="console-font h-40 w-96 bg-black text-wrap break-all text-white"
			tabindex="0"
			role="textbox"
			aria-label="Password input"
			bind:this={divElement}
		>
			<!-- Version number was specifically requested by client -->
			(c) Microsoft Corporation. All rights reserved.<br /><br />
			{#if !error}
				C:\Users\ethanhen>login <br />
				please enter password:
			{:else}
				C:\Users\ethanhen>error<br />
				<a href="https://www.youtube.com/watch?v=XlzJi9-87l4">{error} </a> <br />
			{/if}
			{passwordInput
				.split('')
				.map((_) => '*')
				.join('')}<span class="blinking-text">_</span>
		</div>
	</Window>
</div>

<style>
	a {
		color: white;
	}

	@font-face {
		font-family: 'Console';
		src: url('/fonts/TerminalVector.ttf') format('truetype');
	}

	.console-font {
		font-family: 'Console';
		font-size: 8px;
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		49% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		99% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.blinking-text {
		animation: blink 1s infinite;
	}
</style>
