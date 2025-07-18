
class FileUploader {

    private readonly CHUNK_SIZE = 1024 * 1024 * 5; // 5MB

    public async uploadFile(file: File, url: string, progressCallback: (percent: number) => void, uploadDir: string): Promise<void> {
        let offset = 0;
        let chunkCount = 0;
        const CHUNK_SIZE = this.CHUNK_SIZE;
        const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);

        function uploadChunk() {
            if (offset < file.size) {
                const chunk = file.slice(offset, offset + CHUNK_SIZE);
                const formData = new FormData();
                formData.append('fileChunk', chunk);
                formData.append('fileName', file.name);
                formData.append('fileSize', file.size.toString());
                formData.append('chunkIndex', chunkCount.toString());
                formData.append('totalChunks', totalChunks.toString());

                const xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);

                xhr.setRequestHeader('x-upload-dir', uploadDir); // Custom header for upload directory

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            console.log(`Chunk ${chunkCount + 1} uploaded successfully.`);
                            offset += CHUNK_SIZE;
                            chunkCount++;
                            // progressCallback(chunkCount === 0 ? 0 : (chunkCount / totalChunks) * 100);
                            uploadChunk(); // Upload the next chunk
                        } else {
                            console.error(`Error uploading chunk ${chunkCount + 1}:`, xhr.status, xhr.statusText);
                        }
                    }
                };

                xhr.send(formData);
            }
        }

        uploadChunk();
    }


}

export const fileUploader = new FileUploader();