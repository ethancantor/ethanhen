import { exists } from '$lib';
import { CookieParser } from '$lib/utils/server/CookieParser';
import { sessionManager } from '$lib/utils/server/SessionManager';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import fs from 'fs/promises';
import { join } from 'node:path';

export async function GET({ url }: { url: URL }) {
	await fs.mkdir(UPLOAD_DIR, { recursive: true });

	const paramPath = url.searchParams.get('path');
	const fullPath = paramPath ? join(UPLOAD_DIR, decodeURIComponent(paramPath)) : UPLOAD_DIR;

	if (!(await exists(fullPath))) {
		throw error(404, { message: `Path "${fullPath}" does not exist.` });
	}

	try {
		const folders = await fs.readdir(fullPath, { withFileTypes: true });
		const folderNames = folders.filter((dir) => dir.isDirectory()).map((dir) => dir.name);

		return json({ folders: folderNames }, { status: 200 });
	} catch (e) {
		console.error(`Error reading image directory "${UPLOAD_DIR}":`, e);
		throw error(500, { message: 'Failed to retrieve images.' });
	}
}

export async function POST({ request }: { request: Request }) {
	const apiKey = CookieParser.getAPIKey(request);

	if (!apiKey) {
		return json({ message: 'missing key' }, { status: 401 });
	}

	const validKey = sessionManager.getSession(apiKey);

	if (!validKey || !validKey.isAdmin) {
		return json({ message: 'invalid key' }, { status: 401 });
	}

	if (!request.body) {
		return new Response('No files uploaded', { status: 400 });
	}

	const headerUploadDir = request.headers.get('x-upload-dir');
	const uploadDir = join(process.cwd(), 'uploads', headerUploadDir || '');

	const doesExist = await exists(uploadDir);
	if (!doesExist) {
		console.error(`Upload directory does not exist: ${uploadDir}`);
		return error(500, { message: 'Upload directory does not exist.' });
	}

	try {
		const formData = await request.formData();
		const { fileChunk, fileName, fileSize, chunkIndex, totalChunks } = Object.fromEntries(formData.entries());

		if (!fileChunk || !fileName || !fileSize || !chunkIndex || !totalChunks) {
			return error(400, { message: 'Missing required form data.' });
		}

		const filePath = join(uploadDir, fileName as string);
		const arrayBuffer = await (fileChunk as Blob).arrayBuffer();
		const chunkBuffer = Buffer.from(arrayBuffer);

		try {
			fs.appendFile(filePath, chunkBuffer);
		} catch (err) {
			console.error('Error appending chunk:', err);
			return error(500, { message: 'Error saving chunk.' });
		}
	} catch (err) {
		console.error('Error processing upload:', err);
		return error(500, { message: 'Error processing upload.' });
	}


	return json({ message: 'File uploaded successfully!' }, { status: 200 });
}
