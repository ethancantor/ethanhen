export type UploadItem = {
	id: string;
	file: File;
	progress: number;
	status: 'pending' | 'uploading' | 'done' | 'error';
};
