import { createSession, deleteSession, getSession } from '$lib/utils/server/session-manager';
import { json } from '@sveltejs/kit';

/**
 * Creates a new session and returns the session id.
 * @returns A new session object with a unique ID.
 */
export async function POST() {
	const session = createSession();
	return json({ session: { id: session.id } });
}

/**
 * Retrieves the session details based on the session ID provided in the query parameters.
 */
export async function GET({ url }: { url: URL }) {
	const sessionID = url.searchParams.get('sessionID');
	if (!sessionID) {
		return json({ error: 'Session ID is required' }, { status: 400 });
	}
	const session = getSession(sessionID);
	if (!session) {
		return json({ error: 'Session not found' }, { status: 404 });
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
	const session = getSession(sessionID);
	if (!session) {
		return json({ error: 'Session not found' }, { status: 404 });
	}

	deleteSession(sessionID);
	return json({ message: 'Session deleted successfully' });
}
