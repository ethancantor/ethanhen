import { CookieParser } from '$lib/utils/server/CookieParser';
import { sessionManager } from '$lib/utils/server/SessionManager';
import { error, json } from '@sveltejs/kit';
import 'dotenv/config';

export async function GET({ url, request }: { url: URL; request: Request }) {
	const password = url.searchParams.get('password') || '';
	console.log(request.headers.get('cookie'));

	const apiKey = CookieParser.getAPIKey(request);

	if (!apiKey) {
		return error(401, 'Unauthorized: No API key provided');
	}

	const storedPass = process.env.ADMIN_PASS;
	if (!storedPass) {
		return json({ error: 'No password set' }, { status: 500 });
	} else if (storedPass !== password) {
		return json({ error: 'Wrong password' }, { status: 403 });
	}

	// give admin perms to api key for the session
	sessionManager.validateSession(apiKey);

	return json({ password }, { status: 200 });
}
