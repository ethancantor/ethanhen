import { cookieFetch } from "./CookieFetch.svelte";

class APIFetch {
    public async checkAdmin(): Promise<boolean> {
        const response = await cookieFetch.fetchWithKey('/api/session', {
            method: 'GET',
        });


        console.log('Checking admin status...');

        if (response.ok) {
            const sessionData = await response.json();
            console.log('Session data:', sessionData.session);
            return sessionData.session.isAdmin || false;
        } else {
            console.error('Error fetching session:', response.statusText);
            return false;
        }
    }
}

export const apiFetch = new APIFetch();