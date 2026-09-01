class FileUploader {
	private readonly CHUNK_SIZE = 1024 * 1024 / 3;

	public uploadFile(
		file: File,
		url: string,
		progressCallback: (percent: number) => void,
		uploadDir: string
	): Promise<void> {
		return new Promise((resolve, reject) => {
			let offset = 0;
			let chunkCount = 0;
			const chunkSize = this.CHUNK_SIZE;
			const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));

			const uploadChunk = () => {
				const chunk = file.slice(offset, offset + chunkSize);
				const formData = new FormData();
				formData.append('fileChunk', chunk);
				formData.append('fileName', file.name);
				formData.append('fileSize', file.size.toString());
				formData.append('chunkIndex', chunkCount.toString());
				formData.append('totalChunks', totalChunks.toString());
				formData.append('fileLastModified', file.lastModified.toString());

				const xhr = new XMLHttpRequest();
				xhr.open('POST', url, true);
				xhr.setRequestHeader('x-upload-dir', uploadDir);

				xhr.onreadystatechange = () => {
					if (xhr.readyState !== 4) {
						return;
					}

					if (xhr.status !== 200) {
						reject(
							new Error(
								`Error uploading chunk ${chunkCount + 1}: ${xhr.status} ${xhr.statusText}`
							)
						);
						return;
					}

					chunkCount++;
					progressCallback(Math.round((chunkCount / totalChunks) * 100));

					if (chunkCount >= totalChunks) {
						resolve();
						return;
					}

					offset += chunkSize;
					uploadChunk();
				};

				xhr.onerror = () => {
					reject(new Error(`Network error uploading chunk ${chunkCount + 1}`));
				};

				xhr.send(formData);
			};

			progressCallback(0);
			uploadChunk();
		});
	}
}

export const fileUploader = new FileUploader();
