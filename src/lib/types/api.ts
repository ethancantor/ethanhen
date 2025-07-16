import path from 'node:path';

export type ImageAPIResponse = {
	images: string[];
	folders: string[];
};

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export type FetchFunc = {
	(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
	(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
};

export type Session = {
	id: string;
	expiresAt: Date;
	isAdmin: boolean;
};
