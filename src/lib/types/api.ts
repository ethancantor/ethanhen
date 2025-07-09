import path from 'node:path';

export type ImageAPIResponse = {
	images: string[];
	folders: string[];
};

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
