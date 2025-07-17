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

	async uploadFileWithKey(
		file: File,
		uploadDir: string,
		progressCallback: (percent: number) => void
	): Promise<void> {
		if (!this.isInitialized) {
			await this.initialize();
		}

		if (typeof window === 'undefined') {
			return console.error('This function can only be used on the frontend');
		}

		if (!file) {
			console.log('No files to upload');
			return;
		}

		console.log('Uploading file:', file.name, 'to directory:', uploadDir);

		try {
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					progressCallback((event.loaded / event.total) * 100);
				}
			});

			xhr.open('POST', '/api/upload');
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('x-upload-dir', uploadDir);
			xhr.setRequestHeader('x-api-key', this.apiKey);

			xhr.onload = () => {
				if (xhr.status === 200) {
					console.log('Upload successful:', xhr.responseText);
				} else {
					console.error('Upload failed:', xhr.status, xhr.statusText);
				}
			};

			xhr.onerror = () => {
				console.error('Upload error:', xhr.status, xhr.statusText);
			};

			const formData = new FormData();
			formData.append('file', file);
			xhr.send(formData);
		} catch (err) {
			console.error('Error during upload:', err);
		}
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
		} catch (error) {
			console.error('Error clearing API key:', error);
		}
	}
}

export const fetchStore = new FetchStore();
