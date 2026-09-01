import type { Session } from '$lib/types/api';
import { error } from '@sveltejs/kit';
import { CookieParser } from './CookieParser';
import { sessionManager } from './SessionManager';

export function requireAdmin(request: Request): Session {
	const apiKey = CookieParser.getAPIKey(request);

	if (!apiKey) {
		throw error(401, { message: 'Unauthorized' });
	}

	const session = sessionManager.getSession(apiKey);

	if (!session?.isAdmin) {
		throw error(401, { message: 'Unauthorized' });
	}

	return session;
}
