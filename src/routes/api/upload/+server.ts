import busboy from "busboy";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";

export async function POST({ request }: { request: Request }) {
    if (!request.body) {
        return new Response("No files uploaded", { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'uploaded_images');

    const currentFiles = import.meta.glob('/uploaded_images/*', { eager: true });
    const currentFilesKeys = Object.keys(currentFiles).map(fileName =>
        fileName
            .replace(/\/uploaded_images\//g, '')

    );

    return new Promise((resolve, reject) => {
        // Convert Fetch API Headers to plain object for busboy
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
            console.log(`Uploading: ${filepath}`);

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
            const nodeStream = Readable.from((async function* () {
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
            })());
            nodeStream.pipe(bb);
        } else {
            reject(new Response('Request body is missing.', { status: 400 }));
        }
    });
}