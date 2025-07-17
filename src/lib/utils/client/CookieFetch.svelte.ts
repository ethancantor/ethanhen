import type { FetchFunc } from "$lib/types/api";
import { documentCookie } from "./DocumentCookie";


class CookieFetch {
    private isInitialized = $state(false);
    private isInitializing = $state(false);

    private COOKIE_LENGTH = 2; // in hours

    private async initialize(fetchFn: FetchFunc = fetch): Promise<void> {
        if (this.isInitialized || this.isInitializing) {
            return;
        }

        this.isInitializing = true;

        const cookie = documentCookie.get('apiKey');
        if (!cookie) {
            try {
                const response = await fetchFn('/api/session', {
                    method: 'POST'
                });
                const { session } = await response.json();

                documentCookie.set('apiKey', session.id, this.COOKIE_LENGTH); // Store for 2 hours
                this.isInitialized = true;
            } catch (error) {
                console.error('Failed to initialize API key:', error);
                documentCookie.delete('apiKey');
            }

            console.log('API key initialized and stored in cookie', documentCookie.get('apiKey'));
        } else {
            console.log('Using existing API key from cookie:', cookie);
        }

        console.log('CookieFetch initialized:', documentCookie.get('apiKey'));

        this.isInitializing = false;
    }

    async fetchWithKey(
        input: string | URL | globalThis.Request,
        init?: RequestInit,
        customFetch?: FetchFunc
    ): Promise<Response> {
        const fetchFn = customFetch || fetch;

        if (typeof window === 'undefined') {
            throw new Error('This function can only be used on the frontend');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }

        return await fetchFn(input, init);
    }

    async uploadFileWithKey(
        file: File,
        uploadDir: string,
        progressCallback: (percent: number) => void
    ): Promise<void> {
        if (typeof window === 'undefined') {
            throw new Error('This function can only be used on the frontend');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }


        if (!file) {
            throw new Error('No files to upload');
        }

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
}

export const cookieFetch = new CookieFetch();