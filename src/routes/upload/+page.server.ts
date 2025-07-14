import { fetchWithKey } from '$lib/utils/client/fetch.js';

export async function load({ url, fetch }) {
	let folders: string[] = [];

	const params = url.searchParams.get('path');

	try {
		const path = '/api/upload' + (params !== null ? `?path=${encodeURIComponent(params)}` : '');
		const response = await fetchWithKey(path, undefined, fetch);

		if (response.ok) {
			const data = await response.json();
			folders = data.folders;
		} else {
			console.error('Error fetching folders:', response.statusText);
		}
	} catch (e) {
		console.error('Error fetching folders in load function:', e);
	}

	return { folders };
}
