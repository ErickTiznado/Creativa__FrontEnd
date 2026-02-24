/**
 * Shared image URL extraction utilities.
 * Handles multiple asset formats from the backend:
 *   - string URL
 *   - { preview: string }  (local references)
 *   - { img_url: string }
 *   - { img_url: { original, thumbnail, url } }
 */

/**
 * Extract the best display-quality URL from an asset object.
 * Priority: preview → img_url.original → img_url.url → img_url (string) → img_url.thumbnail
 *
 * @param {string|Object} img - Asset object or direct URL string
 * @returns {string|null} Resolved URL or null
 */
export const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (img.preview && typeof img.preview === 'string') return img.preview;
    if (img.img_url) {
        if (typeof img.img_url === 'string') return img.img_url;
        if (img.img_url.original && typeof img.img_url.original === 'string') return img.img_url.original;
        if (img.img_url.url && typeof img.img_url.url === 'string') return img.img_url.url;
        if (img.img_url.thumbnail && typeof img.img_url.thumbnail === 'string') return img.img_url.thumbnail;
    }
    return null;
};

/**
 * Extract thumbnail URL from an asset, falling back to the full image URL.
 *
 * @param {string|Object} img - Asset object or direct URL string
 * @returns {string|null} Resolved thumbnail URL or null
 */
export const getThumbnailUrl = (img) => {
    if (!img) return null;
    if (img.thumbnail_url && typeof img.thumbnail_url === 'string') return img.thumbnail_url;
    if (img.img_url?.thumbnail && typeof img.img_url.thumbnail === 'string') return img.img_url.thumbnail;
    return getImageUrl(img);
};

/**
 * Download an image from a URL and trigger browser download.
 *
 * @param {string} imageUrl - URL of the image to download
 * @param {string} filename - Desired filename for the download
 */
export const downloadImage = async (imageUrl, filename) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
};
