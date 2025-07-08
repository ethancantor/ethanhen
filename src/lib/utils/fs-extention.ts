import fs from 'fs/promises';

export async function exists(path: string): Promise<boolean> {
    return fs.access(path).then(() => true).catch(() => false);
}