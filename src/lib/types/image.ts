
export type ImageSize = 'thumbnail' | 'gallery' | 'full';
export const ImageSizes: Map<ImageSize, number> = new Map([
    ['thumbnail', 150],
    ['gallery', 600],
    ['full', 0] // 0 means no resizing
]);