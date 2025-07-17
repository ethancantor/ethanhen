import type { Session } from "$lib/types/api";
import { DEFAULT_SESSION_LENGTH } from "../shared/Sessions";

class SessionManager {
    private sessions: Session[] = [];

    public createSession(): Session {
        this.cleanUpExpiredSessions();

        const session: Session = {
            id: crypto.randomUUID(),
            expiresAt: new Date(Date.now() + DEFAULT_SESSION_LENGTH),
            isAdmin: false
        };
        this.sessions.push(session);

        console.log(
            `Created session: ${session.id}, expires at: ${session.expiresAt}, ${this.sessions.length}`
        );

        return session;
    }

    public getSession(id: string): Session | undefined {
        this.cleanUpExpiredSessions();
        console.log(`Getting session for id: ${id}, current sessions: ${this.sessions.length}`);

        const session = this.sessions.find((s) => s.id === id);
        if (session && session.expiresAt > new Date()) {
            return session;
        }

        console.log(`Session not found or expired for id: ${id}`);

        this.deleteSession(id);
        return undefined;
    }

    public deleteSession(id: string): void {
        this.cleanUpExpiredSessions();

        console.log(`Deleting session for id: ${id}, current sessions: ${this.sessions.length}`);
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.sessions.splice(index, 1);
        }
    }

    public validateSession(id: string): Session | undefined {
        this.cleanUpExpiredSessions();

        console.log(`Validating session for id: ${id}, current sessions: ${this.sessions.length}`);
        const session = this.getSession(id);
        if (session) {
            session.isAdmin = true;
        }
        return session;
    }

    private cleanUpExpiredSessions(): void {
        const now = new Date();
        this.sessions = this.sessions.filter((s) => s.expiresAt > now);
        console.log(`Cleaned up expired sessions, remaining: ${this.sessions.length}`);
    }
}

export const sessionManager = new SessionManager();