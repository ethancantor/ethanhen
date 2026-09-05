import { exists } from '$lib';
import { ImageSizes, type ImageSize } from '$lib/types/image';
import { ATTRIBUTES } from '$lib/utils/server/fs-extensions';
import { requireAdmin } from '$lib/utils/server/require-admin';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { setAttribute } from 'fs-xattr';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

function resolveUploadPath(relativePath: string): string {
	const uploadRoot = path.resolve(UPLOAD_DIR);
	const imagePath = path.resolve(uploadRoot, relativePath.replace(/^\/+/, ''));

	if (imagePath !== uploadRoot && !imagePath.startsWith(`${uploadRoot}${path.sep}`)) {
		throw error(400, { message: 'Invalid path.' });
	}

	return imagePath;
}

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

type RequestParams = { image: string, size?: ImageSize };

export const GET: RequestHandler<RequestParams> = async ({ params, url }): Promise<Response> => {
	const filename = decodeURIComponent(params.image);
	const imagePath = path.join(UPLOAD_DIR, filename);

	// console.log("SERVING IMAGE WITH SCALE PARAMETER:", params, url.searchParams.get('scale'));
	const scale = (url.searchParams.get('scale') || 'full') as ImageSize;

	try {
		const imageBuffer = await fs.readFile(imagePath);
		const contentType = getImageContentType(filename);
		// const order = await getAttribute(imagePath, ATTRIBUTES.ORDER).catch(() => 0);

		if (contentType === 'application/octet-stream') {
			throw error(400, { message: 'Unsupported file type.' });
		}

		const processedImageBuffer = await sharp(imageBuffer)
			.resize({
				width: ImageSizes.get(scale) || undefined,
				height: ImageSizes.get(scale) || undefined,
				fit: 'inside',
				withoutEnlargement: true
			})
			.rotate()
			.toBuffer();

		return new Response(new Uint8Array(processedImageBuffer), {
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

export const DELETE: RequestHandler<RequestParams> = async ({ request, params }): Promise<Response> => {
	requireAdmin(request);

	const filename = decodeURIComponent(params.image);
	const imagePath = resolveUploadPath(filename);

	if (imagePath === path.resolve(UPLOAD_DIR)) {
		throw error(400, { message: 'Invalid path.' });
	}

	if (!(await exists(imagePath))) {
		throw error(404, { message: 'Not found.' });
	}

	await fs.rm(imagePath, { recursive: true });

	return json({ success: true });
};

export async function PUT({ request }: { request: Request }): Promise<Response> {
	requireAdmin(request);

	const { order, path } = await request.json();

	const fullPath = path ? path.join(UPLOAD_DIR, decodeURIComponent(path)) : UPLOAD_DIR;
	if (!(await exists(fullPath))) {
		throw error(404, { message: `Path "${fullPath}" does not exist.` });
	}

	try {
		await setAttribute(fullPath, ATTRIBUTES.ORDER, order.toString());
		// console.log(`Set order for "${fullPath}" to ${order}`);
	} catch (e: unknown) {
		throw error(500, { message: `${JSON.stringify(e)}` });
	}

	return json({ success: true, message: 'Image order updated successfully.' }, { status: 200 });
}