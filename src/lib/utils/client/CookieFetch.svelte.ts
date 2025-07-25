import type { FetchFunc } from "$lib/types/api";
import { DEFAULT_SESSION_LENGTH } from "../shared/Sessions";
import { documentCookie } from "./DocumentCookie";
import { fileUploader } from "./FileUploader";

class CookieFetch {
    private isInitialized = $state(false);
    private isInitializing = $state(false);

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

                documentCookie.set('apiKey', session.id, DEFAULT_SESSION_LENGTH); // Store for 2 hours
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

        await fileUploader.uploadFile(file, '/api/upload', progressCallback, uploadDir);
    }
}

export const cookieFetch = new CookieFetch();