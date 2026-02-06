import { api } from "./api";
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Save or update saved assets in the database
 * @param {number} campaignId - ID of the campaign
 * @param {Array} assetUrls - Array of image URLs
 * @returns {Promise} Response from the API
 */
export const saveAssetsToDatabase = async (campaignId, assetUrls) => {
  try {
    const response = await api.post("/assets/save", {
      campaign_id: campaignId,
      asset_urls: assetUrls,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving assets to database:", error);
    throw error;
  }
};

/**
 * Update existing assets in the database
 * @param {number} campaignId - ID of the campaign
 * @param {Array} assetUrls - Array of image URLs
 * @returns {Promise} Response from the API
 */
export const updateAssetsInDatabase = async (campaignId, assetUrls) => {
  try {
    const response = await api.put("/assets/update", {
      campaign_id: campaignId,
      asset_urls: assetUrls,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating assets in database:", error);
    throw error;
  }
};

/**
 * Check if campaign already has saved assets
 * @param {number} campaignId - ID of the campaign
 * @returns {Promise<boolean>} True if assets exist
 */
export const checkCampaignAssets = async (campaignId) => {
  try {
    const response = await api.get(`/assets/check/${campaignId}`);
    return response.data.exists;
  } catch (error) {
    console.error("Error checking campaign assets:", error);
    return false;
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
            : img.img_url.url || img.img_url.thumbnail;
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

/**
 * Download all assets as ZIP and save to database
 * @param {Array} assets - Array of saved assets
 * @param {number} campaignId - ID of the campaign
 * @param {string} zipName - Name for the ZIP file
 * @returns {Promise} Object with zip blob and database response
 */
export const downloadAndSaveAssets = async (
  assets,
  campaignId,
  zipName = "saved_assets",
) => {
  try {
    // Extract URLs for database
    const assetUrls = assets
      .map((img) => {
        if (typeof img === "string") return img;
        if (img.img_url)
          return typeof img.img_url === "string"
            ? img.img_url
            : img.img_url.url;
        return null;
      })
      .filter(Boolean);

    // Check if campaign already has assets
    const assetsExist = await checkCampaignAssets(campaignId);

    // Save or update in database
    let dbResponse;
    if (assetsExist) {
      dbResponse = await updateAssetsInDatabase(campaignId, assetUrls);
    } else {
      dbResponse = await saveAssetsToDatabase(campaignId, assetUrls);
    }

    // Create ZIP file
    const zipBlob = await downloadImagesAsZip(assets, zipName);

    // Trigger download
    saveAs(zipBlob, `${zipName}.zip`);

    return {
      zipBlob,
      dbResponse,
      action: assetsExist ? "updated" : "created",
    };
  } catch (error) {
    console.error("Error in downloadAndSaveAssets:", error);
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
    const response = await api.delete(`/assets/${assetId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};

/**
 * Get all assets from the database
 * @returns {Promise<Array>} Array of assets
 */
export const getAllAssets = async () => {
  try {
    const response = await api.get("/assets");
    // Check if response has data property (standard axios) and if it has success/data structure
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all assets:", error);
    throw error;
  }
};
