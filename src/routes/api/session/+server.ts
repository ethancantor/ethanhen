import { CookieParser } from '$lib/utils/server/CookieParser';
import { sessionManager } from '$lib/utils/server/SessionManager';
import { error, json } from '@sveltejs/kit';

/**
 * Creates a new session and returns the session id.
 * @returns A new session object with a unique ID.
 */
export async function POST() {
	const session = sessionManager.createSession();
	return json({ session: { id: session.id } });
}

/**
 * Retrieves the session details based on the session ID provided in the query parameters.
 */
export async function GET({ request }: { request: Request }) {
	const apiKey = CookieParser.getAPIKey(request);
	if (!apiKey) {
		return error(404, 'Session ID is required');
	}

	let session = sessionManager.getSession(apiKey);
	if (!session) {
		// didnt get session from cookie, create a new one
		session = sessionManager.remakeSession(apiKey);
	}
	return json({ session: { id: session.id, isAdmin: session.isAdmin } });
}

/**
 * Deletes a session based on the session ID provided in the request body.
 */
export async function DELETE({ request }: { request: Request }) {
	const sessionID = request.body ? await request.json().then((data) => data.sessionID) : null;
	if (!sessionID) {
		return json({ error: 'Session ID is required' }, { status: 400 });
	}
	const session = sessionManager.getSession(sessionID);
	if (!session) {
		return json({ error: 'Session not found' }, { status: 404 });
	}

	sessionManager.deleteSession(sessionID);
	return json({ message: 'Session deleted successfully' });
}
