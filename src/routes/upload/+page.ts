import { fetchStore } from '$lib/utils/client/FetchStore.svelte';

export const ssr = false;

export async function load({ url, fetch }) {
	let folders: string[] = [];

	let isAdmin = false;

	const params = url.searchParams.get('path');

	try {
		const path = '/api/upload' + (params !== null ? `?path=${encodeURIComponent(params)}` : '');
		const response = await fetchStore.fetchWithKey(path, undefined, fetch);

		if (response.ok) {
			const data = await response.json();
			folders = data.folders;
		} else {
			console.error('Error fetching folders:', response.statusText);
		}
	} catch (e) {
		console.error('Error fetching folders in load function:', e);
	}

	try {
		const response = await fetchStore.fetchWithKey('/api/session', {
			method: 'GET'
		});

		console.log('Session response:', response);

		if (!response.ok) {
			throw new Error(`Failed to fetch session: ${response.statusText}`);
		}

		const sessionData = await response.json();
		isAdmin = sessionData.session.isAdmin || false;
	} catch (e) {
		console.error('Error during fetch in load function:', e);
	}

	return { folders, isAdmin };
}
