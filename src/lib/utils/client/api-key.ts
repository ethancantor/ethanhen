import { writable } from 'svelte/store';

function createSessionKeyStore() {
	const { subscribe, set } = writable(generateSimpleUniqueKey());

	return {
		subscribe,
		reset: () => {
			if (typeof window !== 'undefined') {
				const newKey = generateSimpleUniqueKey();
				set(newKey);
			}
		}
	};
}

export const sessionKey = createSessionKeyStore();

function generateSimpleUniqueKey() {
	const timestamp = Date.now();
	const randomNumber = Math.random();
	return `${timestamp}-${String(randomNumber).substring(2)}`;
}
