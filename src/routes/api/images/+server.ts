import { exists } from '$lib';
import { ensureImageId } from '$lib/utils/server/image-id';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const IMAGE_REGEX = /\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)$/i;

function uploadTime(stat: Awaited<ReturnType<typeof fs.stat>>): number {
	return Number(stat.birthtimeMs || stat.ctimeMs);
}

export async function GET({ url }: { url: URL }): Promise<Response> {
	await fs.mkdir(UPLOAD_DIR, { recursive: true });

	const paramPath = url.searchParams.get('path');
	const fullPath = paramPath ? path.join(UPLOAD_DIR, decodeURIComponent(paramPath)) : UPLOAD_DIR;

	if (!(await exists(fullPath))) {
		throw error(404, { message: `Path "${fullPath}" does not exist.` });
	}

	try {
		const files = await fs.readdir(fullPath, { withFileTypes: true });
		const withStats = await Promise.all(
			files.map(async (file) => ({
				file,
				stat: await fs.stat(path.join(fullPath, file.name))
			}))
		);

		withStats.sort((a, b) => uploadTime(b.stat) - uploadTime(a.stat));

		const entries = [];
		for (const { file } of withStats) {
			if (file.isDirectory()) {
				entries.push({ type: 'folder' as const, name: file.name });
				continue;
			}

			if (!IMAGE_REGEX.test(file.name)) {
				continue;
			}

			const relativePath = path.relative(UPLOAD_DIR, path.join(fullPath, file.name));
			const imageUrl = `${url.origin}/api/images/${encodeURIComponent(relativePath)}`;
			const id = await ensureImageId(path.join(fullPath, file.name));
			entries.push({ type: 'image' as const, url: imageUrl, id });
		}

		return json({ entries }, { status: 200 });
	} catch (e) {
		console.error(`Error reading image directory "${UPLOAD_DIR}":`, e);
		throw error(500, { message: 'Failed to retrieve images.' });
	}
}
