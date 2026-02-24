import { useState, useEffect, useCallback } from "react";
import { generateImages } from "../services/generatorService";
import { getParentAssets, getAllAssets } from "../services/assetService";

/**
 * Hook for managing image generation state and actions.
 * Single Responsibility: only handles generator-related logic.
 *
 * @param {Object|null} campaign - Campaign object (needs .id and .assets)
 * @param {string} campaignId - Campaign ID from URL params
 * @param {Function} fetchCampaignsById - Function to refresh campaign data
 * @param {Function} setSelectedCamp - Setter for selected campaign context
 */
export function useGenerator(campaign, campaignId, fetchCampaignsById, setSelectedCamp) {
    // --- States ---
    const [prompt, setPrompt] = useState(
        "Jóvenes universitarios, en oficina moderna, participando en Reunión...",
    );
    const [style, setStyle] = useState("cinematic");
    const [useReference, setUseReference] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [imageSize, setImageSize] = useState("2K");
    const [quantity, setQuantity] = useState(1);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState(null);

    // --- Load parent images on mount / when campaignId changes ---
    useEffect(() => {
        if (!campaignId) return;
        let cancelled = false;

        const loadImages = async () => {
            try {
                const images = await getParentAssets(campaignId);
                if (!cancelled) setGeneratedImages(images || []);
            } catch (error) {
                console.error("Error loading parent assets:", error);
            }
        };

        loadImages();
        return () => { cancelled = true; };
    }, [campaignId]);

    // --- Get refinements (children) for a parent asset ---
    const getRefinements = useCallback((parentId) => {
        if (!campaign?.assets) return [];
        return campaign.assets.filter(
            (asset) => asset.parent_asset_id === parentId,
        );
    }, [campaign]);

    // --- Generate images ---
    const handleGenerate = async (referenceImages = []) => {
        if (!prompt || prompt.trim().length === 0) {
            setGenerationError("Por favor ingresa un prompt");
            return;
        }
        if (!campaign?.id) {
            setGenerationError("No hay campaña seleccionada");
            return;
        }

        try {
            setIsGenerating(true);
            setGenerationError(null);

            const result = await generateImages({
                prompt,
                style,
                aspectRatio,
                imageSize,
                quantity,
                useReference,
                referenceImages,
                campaignId: campaign.id,
            });

            const assetObjects = Array.isArray(result)
                ? result
                : (result.data?.assets || result.assets || []);

            if (assetObjects.length > 0) {
                setGeneratedImages((prev) => [...prev, ...assetObjects]);

                // Refresh campaign data in the background
                try {
                    const freshData = await fetchCampaignsById(campaignId);
                    setSelectedCamp(freshData);
                } catch (refreshError) {
                    console.warn("Could not refresh campaign data after generation:", refreshError);
                }
            } else {
                setGenerationError("No se generaron imágenes. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error generating images:", error);
            setGenerationError(
                error.message || "Error al generar imágenes. Intenta de nuevo.",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        prompt,
        setPrompt,
        style,
        setStyle,
        useReference,
        setUseReference,
        aspectRatio,
        setAspectRatio,
        imageSize,
        setImageSize,
        quantity,
        setQuantity,
        generatedImages,
        setGeneratedImages,
        isGenerating,
        generationError,
        handleGenerate,
        getRefinements,
    };
}
