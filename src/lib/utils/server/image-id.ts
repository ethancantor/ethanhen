import { getAttribute, setAttribute } from 'fs-xattr';
import { ATTRIBUTES } from './fs-extensions';

export async function ensureImageId(filePath: string): Promise<string> {
	try {
		return (await getAttribute(filePath, ATTRIBUTES.ID)).toString();
	} catch {
		const id = crypto.randomUUID();
		await setAttribute(filePath, ATTRIBUTES.ID, id);
		return id;
	}
}
