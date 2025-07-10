import type { FolderToggleContext } from '$lib/types/uploads';
import { getContext, setContext } from 'svelte';

const key = {};

export function setFolderToggleContext(toggleContext: FolderToggleContext) {
	setContext<FolderToggleContext>(key, toggleContext);
}

export function getFolderToggleContext(): FolderToggleContext {
	const context = getContext<FolderToggleContext>(key);
	if (!context) {
		throw new Error(
			'FolderToggleContext not found. Make sure to set it using setFolderToggleContext before accessing it.'
		);
	}
	return context;
}
