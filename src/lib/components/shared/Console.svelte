<script lang="ts">
	import { goto } from '$app/navigation';
	import { Window } from '$lib';
	import { onSubmit } from '$lib/utils/client/console-options';

	let input = $state('');

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			onSubmit(input, (newInput: string) => (input = newInput));
		} else if (event.key === 'Backspace') {
			input = input.slice(0, -1);
		} else if (event.key.length === 1) {
			input += event.key;
		}
	}

	const code = 'const add = (a: number, b: number) => a + b;';
</script>

<div class="fixed inset-0 top-[30%] left-[50%] h-fit w-fit max-w-[90vw] translate-x-[-50%]">
	<Window
		hasMenuBar={false}
		hasTopBar={false}
		title="C:\Windows\System32\cmd.exe"
		titleIcon="/windowsIcons/Default Programs/cmd_IDI_APPICON.ico"
	>
		<div
			class="console-font h-40 w-96 overflow-y-auto bg-black text-wrap break-all text-white"
			onkeydown={handleKeyDown}
			tabindex="0"
			role="textbox"
			aria-label="Password input"
		>
			<!-- Version number was specifically requested by client -->
			(c) Microsoft Corporation. All rights reserved.<br /><br />
			C:\Users\ethanhen>
			<span>{input.trim()}</span>
			<span class="blinking-text">_</span>
		</div>
	</Window>
</div>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/svelte-highlight/styles/github.css" />
</svelte:head>

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
