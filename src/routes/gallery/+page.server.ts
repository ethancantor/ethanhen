export async function load({ fetch }) {
	let images: string[] = [];

	try {
		// Fetch image URLs from your custom API endpoint
		const response = await fetch('/api/images');

		if (!response.ok) {
			console.error(
				`Failed to fetch images from /api/images: ${response.status} ${response.statusText}`
			);
		} else {
			images = await response.json();
		}
	} catch (e) {
		console.error('Error fetching images in load function:', e);
	}

	return {
		images
	};
}
