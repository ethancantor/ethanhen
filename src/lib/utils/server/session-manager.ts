import type { Session } from '$lib/types/api';

const sessions: Session[] = [];

const DEFAULT_SESSION_LENGTH = 30 * 60 * 1000; // 30 minutes

export function createSession(): Session {
	const session: Session = {
		id: crypto.randomUUID(),
		expiresAt: new Date(Date.now() + DEFAULT_SESSION_LENGTH),
		isAdmin: false
	};
	sessions.push(session);

	// console.log(
	// 	`Created session: ${session.id}, expires at: ${session.expiresAt}, ${JSON.stringify(sessions)}`
	// );

	return session;
}

export function getSession(id: string): Session | undefined {
	// console.log(`Getting session for id: ${id}, current sessions: ${JSON.stringify(sessions)}`);

	const session = sessions.find((s) => s.id === id);
	if (session && session.expiresAt > new Date()) {
		return session;
	}
	deleteSession(id);
	return undefined;
}

export function deleteSession(id: string): void {
	// console.log(`Deleting session for id: ${id}, current sessions: ${JSON.stringify(sessions)}`);
	const index = sessions.findIndex((s) => s.id === id);
	if (index !== -1) {
		sessions.splice(index, 1);
	}
}

export function validateSession(id: string): Session | undefined {
	// console.log(`Validating session for id: ${id}, current sessions: ${JSON.stringify(sessions)}`);
	const session = getSession(id);
	if (session) {
		session.isAdmin = true;
	}
	return session;
}
