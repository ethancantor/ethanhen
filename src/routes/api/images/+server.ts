// src/routes/api/images/+server.js
import { exists } from '$lib';
import { ATTRIBUTES } from '$lib/utils/server/fs-extensions.js';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import { getAttribute } from 'fs-xattr';
import fs from 'fs/promises';
import path from 'path';

export async function GET({ url }): Promise<Response> {
	await fs.mkdir(UPLOAD_DIR, { recursive: true });

	const paramPath = url.searchParams.get('path');
	const fullPath = paramPath ? path.join(UPLOAD_DIR, decodeURIComponent(paramPath)) : UPLOAD_DIR;

	if (!(await exists(fullPath))) {
		throw error(404, { message: `Path "${fullPath}" does not exist.` });
	}

	try {
		const files = await fs.readdir(fullPath, { withFileTypes: true });

		const orders = await Promise.all(
			files.map(async (file, index) => ({
				file,
				order: await getAttribute(path.join(fullPath, file.name),
					ATTRIBUTES.ORDER).then(attr => Number(attr.toString())).catch(() => index)
			}))
		);

		const imageFiles = orders
			.filter((order) => /\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)$/i.test(order.file.name))
			.sort((a, b) => a.order - b.order)
			.map(
				(order) =>
					`${url.origin}/api/images/${encodeURIComponent(`${order.file.parentPath.replace(UPLOAD_DIR, '')}/${order.file.name}`)}`
			);

		const folders = files.filter((file) => file.isDirectory()).map((file) => file.name);

		return json({ images: imageFiles, folders }, { status: 200 });
	} catch (e) {
		console.error(`Error reading image directory "${UPLOAD_DIR}":`, e);
		throw error(500, { message: 'Failed to retrieve images.' });
	}
}
