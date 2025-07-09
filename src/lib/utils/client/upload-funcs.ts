export function uploadFile(
	file: File,
	uploadDir: string,
	progressCallback: (percent: number) => void
) {
	if (typeof window === 'undefined') {
		return console.error('This function can only be used on the frontend');
	}

	if (!file) {
		console.log('No files to upload');
		return;
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
