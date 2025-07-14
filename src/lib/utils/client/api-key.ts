import { writable } from 'svelte/store';

// Function to initialize the store
function createSessionKeyStore() {
	// Create a writable Svelte store with the initial key
	const { subscribe, set } = writable(generateSimpleUniqueKey());

	return {
		subscribe,
		// You can add methods to manually reset the key if needed
		reset: () => {
			if (typeof window !== 'undefined') {
				const newKey = generateSimpleUniqueKey();
				set(newKey);
			}
		}
	};
}

// Export the initialized store
export const sessionKey = createSessionKeyStore();

function generateSimpleUniqueKey() {
	const timestamp = Date.now();
	const randomNumber = Math.random();
	return `${timestamp}-${String(randomNumber).substring(2)}`;
}
