import type { FetchFunc } from '$lib/types/api';

class FetchStore {
	private apiKey = $state('');
	private isInitialized = $state(false);
	private isInitializing = $state(false);

	private async initialize(fetchFn: FetchFunc = fetch): Promise<void> {
		if (this.isInitialized || this.isInitializing) {
			console.log('FetchStore is already initialized or initializing.');
			return;
		}

		this.isInitializing = true;

		try {
			console.log('Fetching API key from /api/session');
			const response = await fetchFn('/api/session', {
				method: 'POST'
			});
			const { session } = await response.json();
			console.log('FetchStore response, session:', session);
			this.apiKey = session.id;
			this.isInitialized = true;
			console.log('FetchStore initialized with API key:', this.apiKey);
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

		if (!this.isInitialized) {
			await this.initialize(fetchFn);
		}

		return await fetchFn(input, {
			...init,
			headers: {
				...init?.headers,
				'X-API-Key': this.apiKey
			}
		});
	}
}

export const fetchStore = new FetchStore();
