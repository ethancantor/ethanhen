import { UPLOAD_DIR } from '$lib/utils/server/upload-path';
import { error, json } from '@sveltejs/kit';
import 'dotenv/config';
import fs from 'fs/promises';

export async function POST({ request }: { request: Request }) {
	if (!request.body) {
		return error(400, 'No dir uploaded');
	}

	const requestBody = await request.json();

	if (!requestBody.password) {
		return error(400, 'Please provide a password');
	}

	const password = requestBody.password;

	const storedPass = process.env.ADMIN_PASS;

	if (!storedPass || storedPass !== password) {
		console.log(`Invalid password attempt: ${password} ${storedPass}`);
		return error(403, 'Wrong password... Ethan cmon');
	}

	const dir = requestBody.dir;
	const fullDir = UPLOAD_DIR + '/' + dir;

	try {
		await fs.mkdir(fullDir, { recursive: true });
	} catch (err) {
		console.error(`Error creating directory: ${err} ${fullDir}`);
		return error(500, 'Failed to create directory');
	}

	return json({ message: 'Directory created' }, { status: 200 });
}
