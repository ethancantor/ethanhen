
export function handleUploadClick(file: File, progressCallback: (percent: number) => void) {
    if (!file) {
        console.log('No files to upload');
        return;
    }

    try {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressCallback(percentComplete);
                console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
            }
        });

        xhr.open('POST', '/api/upload');
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('Upload successful:', xhr.responseText);
            } else {
                console.error('Upload failed:', xhr.status, xhr.statusText);
            }
        }

        xhr.onerror = () => {
            console.error('Upload error:', xhr.status, xhr.statusText);
        }

        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);

    } catch (err) {
        console.error('Error during upload:', err);
    }

}