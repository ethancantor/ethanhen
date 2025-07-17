import { exists } from '$lib';
import { getSession } from '$lib/utils/server/session-manager';
import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import busboy from 'busboy';
import fs from 'fs/promises';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';

export async function POST({ request }: { request: Request }) {
	const apiKey = request.headers.get('x-api-key');

	if (!apiKey) {
		return json({ message: 'missing key' }, { status: 401 });
	}

	const validKey = getSession(apiKey);

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
		return new Response('Upload directory does not exist.', { status: 500 });
	}

	const currentFiles = await fs.readdir(uploadDir, { withFileTypes: true });
	const currentFilesKeys = currentFiles.map((file) => file.name);

	return new Promise((resolve, reject) => {
		const headersObj: Record<string, string> = {};
		request.headers.forEach((value, key) => {
			headersObj[key.toLowerCase()] = value;
		});
		const bb = busboy({ headers: headersObj });

		bb.on('file', (name, file, info) => {
			let filename = info.filename;

			if (currentFilesKeys.includes(filename)) {
				let numFilesOfSameName = 0;
				while (currentFilesKeys.includes(filename)) {
					numFilesOfSameName++;
					const fileExtension = filename.split('.').pop();
					const baseName = filename.replace(`.${fileExtension}`, '');
					filename = `${baseName.replace(/\[.*?\]/g, '')}[${numFilesOfSameName}].${fileExtension}`;
				}
			}

			const filepath = join(uploadDir, filename);

			const writeStream = createWriteStream(filepath);
			file.pipe(writeStream);

			writeStream.on('close', () => {
				console.log(`File ${filename} uploaded.`);
			});

			writeStream.on('error', (err) => {
				console.error(`Error writing file ${filename}:`, err);
				reject(new Response('Error saving file.', { status: 500 }));
			});
		});

		bb.on('field', (name, val) => {
			// Handle other form fields if any
			console.log(`Field [${name}]: ${val}`);
		});

		bb.on('close', () => {
			resolve(new Response('File uploaded successfully!', { status: 200 }));
		});

		bb.on('error', (err) => {
			console.error('Busboy error:', err);
			reject(new Response('File upload parsing error.', { status: 500 }));
		});

		// Pipe the SvelteKit request body (ReadableStream) to busboy
		if (request.body) {
			const nodeStream = Readable.from(
				(async function* () {
					const reader = request.body?.getReader();
					if (!reader) {
						return;
					}
					try {
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							yield value;
						}
					} finally {
						reader.releaseLock();
					}
				})()
			);

			nodeStream.pipe(bb);
		} else {
			reject(new Response('Request body is missing.', { status: 400 }));
		}
	});
}

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
