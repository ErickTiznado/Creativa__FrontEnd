import { api } from "./api";
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Get all assets from the database for a specific campaign.
 * @param {string} campaignId - The campaign ID to fetch assets for.
 * @returns {Promise<Array>} Array of assets
 */
export const getAllAssets = async (campaignId) => {
  try {
    if (!campaignId) {
      // Without campaignId, backend will return 400. Return empty to be safe.
      console.warn("getAllAssets called without campaignId");
      return [];
    }
    const response = await api.get(`/asset?campaign_id=${campaignId}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all assets:", error);
    throw error;
  }
};

export const updateAssetApprove = async (assetId) => {
  try {

    /* {
      "id": "uuid-del-asset",
      "is_approved": true,
      "img_url": {
        "original": "https://storage.googleapis.com/.../approved/...",
        "thumbnail": "https://storage.googleapis.com/.../approved/..."
      },
      "storage_location": "approved",
      "...": "otros campos del asset actualizado"
    }
     */
    const response = await api.post(`/asset/${assetId}/approve`);
    console.log(response)
    return response.data
  } catch (e) {
    console.log(e)
  }
}


/**
 * Get all globally approved assets across all campaigns.
 * @returns {Promise<Array>} Array of approved assets
 */
export const getGlobalApprovedAssets = async () => {
  try {
    const response = await api.get(`/assets?is_approved=true`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error("Error fetching global approved assets:", error);
    throw error;
  }
};

/**
 * Delete an asset and its children
 * @param {string} assetId - ID of the asset to delete
 * @returns {Promise} Response from the API
 */
export const deleteAsset = async (assetId) => {
  try {
    const response = await api.delete(`/asset/${assetId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};

/**
 * Download images and create ZIP file
 * @param {Array} imageUrls - Array of image URLs (strings or objects with url property)
 * @param {string} zipName - Name for the ZIP file
 * @returns {Promise<Blob>} ZIP file blob
 */
export const downloadImagesAsZip = async (imageUrls, zipName = "assets") => {
  const zip = new JSZip();
  const folder = zip.folder("assets");

  try {
    // Convert image references to URLs
    const urls = imageUrls
      .map((img) => {
        if (typeof img === "string") return img;
        if (img.preview && typeof img.preview === "string") return img.preview;
        if (img.img_url)
          return typeof img.img_url === "string"
            ? img.img_url
            : img.img_url.original || img.img_url.url || img.img_url.thumbnail;
        return null;
      })
      .filter(Boolean);

    if (urls.length === 0) {
      throw new Error("No valid image URLs found");
    }

    // Download each image and add to ZIP
    const promises = urls.map(async (url, index) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const extension = url.split(".").pop().split("?")[0] || "jpg";
        const fileName = `asset_${index + 1}.${extension}`;
        folder.file(fileName, blob);
      } catch (error) {
        console.error(`Error downloading image ${index + 1}:`, error);
      }
    });

    await Promise.all(promises);

    // Generate ZIP and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${zipName}.zip`);
    return content;
  } catch (error) {
    console.error("Error creating ZIP file:", error);
    throw error;
  }
};
