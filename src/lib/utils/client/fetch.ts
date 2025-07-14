import { get } from 'svelte/store';
import { sessionKey } from './api-key';

export async function fetchWithKey(
	input: string | URL | globalThis.Request,
	init?: RequestInit
): Promise<Response> {
	return await fetch(input, {
		...init,
		headers: {
			...init?.headers,
			'X-API-Key': get(sessionKey)
		}
	});
}
