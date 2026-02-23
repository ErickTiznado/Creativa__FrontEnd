import { api } from "./api";

/**
 * Fetch saved assets for a campaign
 * @param {string} campaignId - UUID of the campaign
 * @returns {Promise<Array>} Array of saved assets
 */
export const fetchSavedAssets = async (campaignId) => {
  try {
    const response = await api.get(
      `/assets?is_saved=true&campaign_id=${campaignId}`,
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
    // Uses PATCH /assets/:id which only updates is_saved, without triggering approve flow
    const response = await api.patch(`/assets/${assetId}`, {
      is_saved: isSaved,
    });
    return response.data.data || { id: assetId, is_saved: isSaved };
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
