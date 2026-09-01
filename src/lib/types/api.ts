export type GalleryEntry =
	| { type: 'image'; url: string }
	| { type: 'folder'; name: string };

export type ImageAPIResponse = {
	entries: GalleryEntry[];
};

export type FetchFunc = {
	(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
	(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
};

export type Session = {
	id: string;
	expiresAt: Date;
	isAdmin: boolean;
};
