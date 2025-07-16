import type { FetchFunc } from '$lib/types/api';

class FetchStore {
	private apiKey = $state('');
	private isInitialized = $state(false);
	private isInitializing = $state(false);

	private async initialize(fetchFn: FetchFunc = fetch): Promise<void> {
		if (this.isInitialized || this.isInitializing) {
			return;
		}

		this.isInitializing = true;

		try {
			const response = await fetchFn('/api/session', {
				method: 'POST'
			});
			const { session } = await response.json();
			this.apiKey = session.id;
			this.isInitialized = true;
		} catch (error) {
			console.error('Failed to initialize API key:', error);
			this.apiKey = '';
		} finally {
			this.isInitializing = false;
		}
	}

	async fetchWithKey(
		input: string | URL | globalThis.Request,
		init?: RequestInit,
		customFetch?: FetchFunc
	): Promise<Response> {
		const fetchFn = customFetch || fetch;

		await this.initialize(fetchFn);

		console.log('Using API key:', this.apiKey);

		return await fetchFn(input, {
			...init,
			headers: {
				...init?.headers,
				'X-API-Key': this.apiKey
			}
		});
	}

	async clearAPIKey(fetchFn: FetchFunc = fetch): Promise<void> {
		try {
			await fetchFn('/api/session', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ sessionID: this.apiKey })
			});

			this.apiKey = '';
			this.isInitialized = false;
			this.isInitializing = false;
			console.log('API key cleared and FetchStore reset.');
		} catch (error) {
			console.error('Error clearing API key:', error);
		}
	}
}

export const fetchStore = new FetchStore();
