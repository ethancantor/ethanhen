import { getAttribute, setAttribute } from 'fs-xattr';
import { ATTRIBUTES } from './fs-extensions';

export async function ensureImageId(filePath: string): Promise<string> {
	try {
		const existing = (await getAttribute(filePath, ATTRIBUTES.ID)).toString();
		if (existing) {
			return existing;
		}
	} catch {
		// missing attribute
	}

	const id = crypto.randomUUID();
	await setAttribute(filePath, ATTRIBUTES.ID, id);
	return id;
}
