import { useState, useEffect, useCallback } from "react";
import {
  fetchSavedAssets,
  updateAssetSaveStatus,
} from "../services/assetsService";

/**
 * Custom hook for managing saved assets with backend persistence
 * @param {string} campaignId - UUID of the campaign
 * @returns {Object} { savedAssets, loading, toggleSaveAsset, refetch }
 */
export function useSavedAssets(campaignId) {
  const [savedAssets, setSavedAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved assets from backend
  const fetchAssets = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      setError(null);
      const assets = await fetchSavedAssets(campaignId);
      setSavedAssets(assets);
    } catch (err) {
      console.error("Error loading saved assets:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  // Toggle save status of an asset
  const toggleSaveAsset = async (assetId, currentlySaved) => {
    try {
      const newSaveStatus = !currentlySaved;

      // Optimistic update
      if (newSaveStatus) {
        // We'll add the full asset after API response
      } else {
        // Remove from local state immediately
        setSavedAssets((prev) => prev.filter((a) => a.id !== assetId));
      }

      // Update on backend
      const updatedAsset = await updateAssetSaveStatus(assetId, newSaveStatus);

      // Update local state with server response
      if (newSaveStatus) {
        setSavedAssets((prev) => {
          // Check if already exists to avoid duplicates
          const exists = prev.some((a) => a.id === assetId);
          if (exists) {
            return prev.map((a) => (a.id === assetId ? updatedAsset : a));
          }
          return [...prev, updatedAsset];
        });
      }

      return updatedAsset;
    } catch (err) {
      console.error("Error toggling save status:", err);
      // Revert optimistic update on error
      await fetchAssets();
      throw err;
    }
  };

  // Load saved assets on mount and when campaignId changes
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    savedAssets,
    loading,
    error,
    toggleSaveAsset,
    refetch: fetchAssets,
  };
}
