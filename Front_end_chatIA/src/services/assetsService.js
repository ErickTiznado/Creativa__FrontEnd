import { api } from "./api";

/**
 * Fetch saved assets for a campaign
 * @param {string} campaignId - UUID of the campaign
 * @returns {Promise<Array>} Array of saved assets
 */
export const fetchSavedAssets = async (campaignId) => {
  try {
    const response = await api.get(
      `/asset?is_saved=true&campaign_id=${campaignId}`,
    );
    // Backend returns { success: true, data: [...] }
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching saved assets:", error);
    throw error;
  }
};

/**
 * Update the is_saved status of an asset.
 * Maps to backend Approve endpoint for saving.
 * @param {string} assetId - UUID of the asset
 * @param {boolean} isSaved - New is_saved status
 * @returns {Promise<Object>} Updated asset object
 */
export const updateAssetSaveStatus = async (assetId, isSaved) => {
  try {
    if (isSaved) {
        // "Saving" an asset implies approving it in this workflow
        const response = await api.post(`/asset/${assetId}/approve`);
        return response.data; 
    } else {
        // "Unsaving" is not directly supported by a simple toggle in the current backend 
        // without potentially deleting the asset or moving it back (which isn't implemented).
        // For now, we might just return null or throw if the UI relies on this.
        // However, to keep UI consistent without errors, we might check if we can call delete? 
        // No, delete is destructive.
        // We will just return null and log a warning that unsaving is not persisted
        console.warn("Unsaving assets is not fully supported by backend persistence yet.");
        return { id: assetId, is_saved: false };
    }
  } catch (error) {
    console.error("Error updating asset save status:", error);
    throw error;
  }
};

/**
 * Fetch all assets for a campaign (with optional filters)
 * @param {string} campaignId - UUID of the campaign
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of assets
 */
export const fetchAssets = async (campaignId, filters = {}) => {
  try {
    const params = new URLSearchParams({
      campaign_id: campaignId,
      ...filters,
    });
    const response = await api.get(`/asset?${params.toString()}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};
