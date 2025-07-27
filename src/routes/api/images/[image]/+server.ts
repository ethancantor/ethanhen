import { exists } from '$lib';
import { ATTRIBUTES } from '$lib/utils/server/fs-extensions';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import { setAttribute } from 'fs-xattr';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

function getImageContentType(filename: string): string {
	const ext = path.extname(filename).toLowerCase();
	switch (ext) {
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg';
		case '.png':
			return 'image/png';
		case '.gif':
			return 'image/gif';
		case '.webp':
			return 'image/webp';
		case '.avif':
			return 'image/avif';
		case '.tiff':
			return 'image/tiff';
		case '.heif':
			return 'image/heif';
		default:
			return 'application/octet-stream';
	}
}

export async function GET({ params }: { params: { image: string } }): Promise<Response> {
	const filename = decodeURIComponent(params.image);
	const imagePath = path.join(UPLOAD_DIR, filename);

	try {
		const imageBuffer = await fs.readFile(imagePath);
		const contentType = getImageContentType(filename);
		// const order = await getAttribute(imagePath, ATTRIBUTES.ORDER).catch(() => 0);

		if (contentType === 'application/octet-stream') {
			throw error(400, { message: 'Unsupported file type.' });
		}

		const processedImageBuffer = await sharp(imageBuffer)
			.resize({ width: Math.round(0.5 * (await sharp(imageBuffer).metadata()).width) }) // Scale width by 50%, height auto
			.toBuffer();

		return new Response(processedImageBuffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000' // Cache images for a year
			}
		});
	} catch (e: unknown) {
		console.error(`Error serving image "${filename}":`, e);
		if (
			typeof e === 'object' &&
			e !== null &&
			'code' in e &&
			(e as { code?: string }).code === 'ENOENT'
		) {
			throw error(404, { message: 'Image not found.' });
		}
		throw error(500, { message: 'Failed to serve image.' });
	}
}

export async function PUT({ request }: { request: Request }): Promise<Response> {
	const { order, path } = await request.json();

	const fullPath = path ? path.join(UPLOAD_DIR, decodeURIComponent(path)) : UPLOAD_DIR;
	if (!(await exists(fullPath))) {
		throw error(404, { message: `Path "${fullPath}" does not exist.` });
	}

	try {
		await setAttribute(fullPath, ATTRIBUTES.ORDER, order.toString());
		console.log(`Set order for "${fullPath}" to ${order}`);
	} catch (e: unknown) {
		throw error(500, { message: `${JSON.stringify(e)}` });
	}

	return json({ success: true, message: 'Image order updated successfully.' }, { status: 200 });
}