import fs from 'fs/promises';

export async function exists(path: string): Promise<boolean> {
	if (typeof window !== 'undefined') {
		throw new Error('File existence check is not supported in the browser environment.');
	}

	return fs
		.access(path)
		.then(() => true)
		.catch(() => false);
}

export enum ATTRIBUTES {
	ORDER = 'user.order',
}