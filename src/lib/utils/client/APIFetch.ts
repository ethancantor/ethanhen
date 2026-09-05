import { cookieFetch } from "./CookieFetch.svelte";

class APIFetch {
	public async checkAdmin(): Promise<boolean> {
		const response = await cookieFetch.fetchWithKey('/api/session', {
			method: 'GET',
		});


		if (response.ok) {
			const sessionData = await response.json();
			return sessionData.session.isAdmin || false;
		} else {
			console.error('Error fetching session:', response.statusText);
			return false;
		}
	}

	public async revokeAdmin(): Promise<void> {
		const response = await cookieFetch.fetchWithKey('/api/session', {
			method: 'PATCH'
		});

		if (!response.ok) {
			console.error('Error revoking admin:', response.statusText);
		}
	}
}

export const apiFetch = new APIFetch();