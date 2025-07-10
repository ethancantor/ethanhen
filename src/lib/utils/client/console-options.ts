const inputOptions = new Map<string, () => void>([
	['ethan cantor', () => window.open('https://escantor.com', '_blank')]
]);

export function onSubmit(input: string) {
	const command = inputOptions.get(input.toLowerCase());

	if (command) {
		command();
	}
}
