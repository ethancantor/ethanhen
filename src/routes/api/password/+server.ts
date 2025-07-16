import { validateSession } from '$lib/utils/server/session-manager';
import { json } from '@sveltejs/kit';
import 'dotenv/config';

export async function GET({ url, request }: { url: URL; request: Request }) {
	const password = url.searchParams.get('password') || '';

	const apiKey = request.headers.get('x-api-key');
	if (!apiKey) {
		return json({ error: 'API key is required' }, { status: 401 });
	}

	const storedPass = process.env.ADMIN_PASS;
	if (!storedPass) {
		return json({ error: 'No password set' }, { status: 500 });
	} else if (storedPass !== password) {
		return json({ error: 'Wrong password' }, { status: 403 });
	}

	// give admin perms to api key for the session
	validateSession(apiKey);

	return json({ password }, { status: 200 });
}
