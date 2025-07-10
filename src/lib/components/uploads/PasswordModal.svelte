<script lang="ts">
	import Window from '../window/Window.svelte';

	const { handleSubmit }: { handleSubmit: (password: string) => Promise<Response> } = $props();

	let passwordInput = $state('');
	let error = $state<string | null>(null);

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
		const response = await handleSubmit(passwordInput);
		if (response.ok) {
			console.log('Password accepted');
			error = null;
		} else {
			error = 'Incorrect password. Please try again.';
			passwordInput = '';
			return false;
		}
	}
</script>

<div class="fixed inset-0 top-[30%] left-[50%] h-fit w-fit translate-x-[-50%]">
	<Window
		hasMenuBar={false}
		hasTopBar={false}
		title="C:\Windows\System32\cmd.exe"
		titleIcon="/windowsIcons/Default Programs/cmd_IDI_APPICON.ico"
	>
		<div
			class="console-font h-40 w-96 bg-black text-wrap break-all text-white"
			onkeydown={handleKeyDown}
			tabindex="0"
			role="textbox"
			aria-label="Password input"
		>
			<!-- Version number was specifically requested by client -->
			(c) Microsoft Corporation. All rights reserved.<br /><br />
			{#if !error}
				C:\Users\ethanhen>login <br />
				please enter password:
			{:else}
				C:\Users\ethanhen>error<br />{error} <br />
			{/if}
			{passwordInput
				.split('')
				.map((_) => '*')
				.join('')}<span class="blinking-text">_</span>
		</div>
	</Window>
</div>

<style>
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
