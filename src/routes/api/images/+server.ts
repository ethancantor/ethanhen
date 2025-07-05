// src/routes/api/images/+server.js
import { error, json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploaded_images');

export async function GET({ url }) {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        const files = await fs.readdir(UPLOAD_DIR);

        const imageFiles = files
            .filter(file => /\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)$/i.test(file))
            .map(file => `${url.origin}/api/images/${file}`);

        return json(imageFiles, { status: 200 });

    } catch (e) {
        console.error(`Error reading image directory "${UPLOAD_DIR}":`, e);
        throw error(500, { message: 'Failed to retrieve images.' });
    }
}

