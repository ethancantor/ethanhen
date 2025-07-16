import { createSession, deleteSession, getSession } from '$lib/utils/server/session-manager';
import { json } from '@sveltejs/kit';

export async function POST() {
	const session = createSession();
	return json({ session });
}

export async function GET({ url }: { url: URL }) {
	const sessionID = url.searchParams.get('sessionID');
	if (!sessionID) {
		return json({ error: 'Session ID is required' }, { status: 400 });
	}
	const session = getSession(sessionID);
	if (!session) {
		return json({ error: 'Session not found' }, { status: 404 });
	}
	return json({ session });
}

export async function DELETE({ url }: { url: URL }) {
	const sessionID = url.searchParams.get('sessionID');
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
