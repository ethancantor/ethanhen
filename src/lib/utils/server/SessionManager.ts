import type { Session } from "$lib/types/api";

class SessionManager {
    private sessions: Session[] = [];
    private readonly DEFAULT_SESSION_LENGTH = 30 * 60 * 1000; //

    public createSession(): Session {
        const session: Session = {
            id: crypto.randomUUID(),
            expiresAt: new Date(Date.now() + this.DEFAULT_SESSION_LENGTH),
            isAdmin: false
        };
        this.sessions.push(session);

        console.log(
            `Created session: ${session.id}, expires at: ${session.expiresAt}, ${JSON.stringify(this.sessions)}`
        );

        return session;
    }

    public getSession(id: string): Session | undefined {
        console.log(`Getting session for id: ${id}, current sessions: ${JSON.stringify(this.sessions)}`);

        const session = this.sessions.find((s) => s.id === id);
        if (session && session.expiresAt > new Date()) {
            return session;
        }

        console.log(`Session not found or expired for id: ${id}`);

        this.deleteSession(id);
        return undefined;
    }

    public deleteSession(id: string): void {
        console.log(`Deleting session for id: ${id}, current sessions: ${JSON.stringify(this.sessions)}`);
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.sessions.splice(index, 1);
        }
    }

    public validateSession(id: string): Session | undefined {
        console.log(`Validating session for id: ${id}, current sessions: ${JSON.stringify(this.sessions)}`);
        const session = this.getSession(id);
        if (session) {
            session.isAdmin = true;
        }
        return session;
    }
}

export const sessionManager = new SessionManager();