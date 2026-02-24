import { useState, useEffect, useCallback } from "react";
import {
    getGlobalApprovedAssets,
    deleteAsset,
    updateAssetApprove,
} from "../services/assetService";

/**
 * Hook for managing the repository of approved assets.
 * Single Responsibility: only handles repository state and actions.
 */
export function useRepository() {
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // --- Load globally approved assets on mount ---
    useEffect(() => {
        const loadRepoAssets = async () => {
            try {
                setLoadingAssets(true);
                const allAssets = await getGlobalApprovedAssets();
                setAssets(allAssets || []);
            } catch (error) {
                console.error("Error loading repository assets:", error);
            } finally {
                setLoadingAssets(false);
            }
        };

        loadRepoAssets();
    }, []);

    // --- Selection ---
    const toggleSelection = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
        );
    }, []);

    // --- Approve ---
    const handleApproveAsset = useCallback(async (assetId) => {
        try {
            await updateAssetApprove(assetId);
            // Refresh to get updated storage URLs
            const refreshed = await getGlobalApprovedAssets();
            setAssets(refreshed || []);
        } catch (e) {
            console.error("Error approving asset:", e);
        }
    }, []);

    // --- Delete ---
    const handleDeleteAsset = useCallback(async (assetId) => {
        try {
            await deleteAsset(assetId);
            setAssets((prev) => prev.filter((a) => a.id !== assetId));
            setSelectedIds((prev) => prev.filter((id) => id !== assetId));
            return true;
        } catch (error) {
            console.error("Error deleting asset:", error);
            throw error;
        }
    }, []);

    return {
        assets,
        setAssets,
        loadingAssets,
        selectedIds,
        toggleSelection,
        handleApproveAsset,
        handleDeleteAsset,
    };
}
