export type ImageAPIResponse = {
	images: string[];
	folders: string[];
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
