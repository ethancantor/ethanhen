// src/routes/api/images/+server.js
import { exists } from '$lib';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export async function GET({ url }) {
	await fs.mkdir(UPLOAD_DIR, { recursive: true });

	const paramPath = url.searchParams.get('path');
	const fullPath = paramPath ? path.join(UPLOAD_DIR, decodeURIComponent(paramPath)) : UPLOAD_DIR;

	if (!(await exists(fullPath))) {
		throw error(404, { message: `Path "${fullPath}" does not exist.` });
	}

	try {
		const files = await fs.readdir(fullPath, { withFileTypes: true });

		const imageFiles = files
			.filter((file) => /\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)$/i.test(file.name))
			.map(
				(file) =>
					`${url.origin}/api/images/${encodeURIComponent(`${file.parentPath.replace(UPLOAD_DIR, '')}/${file.name}`)}`
			);

		const folders = files.filter((file) => file.isDirectory()).map((file) => file.name);

		return json({ images: imageFiles, folders }, { status: 200 });
	} catch (e) {
		console.error(`Error reading image directory "${UPLOAD_DIR}":`, e);
		throw error(500, { message: 'Failed to retrieve images.' });
	}
}
