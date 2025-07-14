import type { Fetch } from '$lib/types/api';
import { get } from 'svelte/store';
import { sessionKey } from './api-key';

export async function fetchWithKey(
	input: string | URL | globalThis.Request,
	init?: RequestInit | undefined,
	customFetch?: Fetch
): Promise<Response> {

	const apiKey = get(sessionKey);

	if (customFetch) {
		return await customFetch(input, {
			...init,
			headers: {
				...init?.headers,
				'X-API-Key': apiKey
			}
		});
	}

	return await fetch(input, {
		...init,
		headers: {
			...init?.headers,
			'X-API-Key': apiKey
		}
	});
}
