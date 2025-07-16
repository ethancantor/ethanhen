import type { ImageAPIResponse } from '$lib/types/api';
import { fetchStore } from '$lib/utils/client/FetchStore.svelte';

export const ssr = false;

export async function load({ url, fetch }) {
	let files: ImageAPIResponse = { images: [], folders: [] };

	const params = url.searchParams.get('path');

	try {
		// Fetch image URLs from your custom API endpoint
		const path = '/api/images' + (params !== null ? `?path=${encodeURIComponent(params)}` : '');
		const response = await fetchStore.fetchWithKey(path, undefined, fetch);

		if (!response.ok) {
			console.error(
				`Failed to fetch images from /api/images: ${response.status} ${response.statusText}`
			);
		} else {
			files = await response.json();
		}
	} catch (e) {
		console.error('Error fetching images in load function:', e);
	}

	return {
		files
	};
}
