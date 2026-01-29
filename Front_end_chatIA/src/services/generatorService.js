/**
 * Generator Service
 * Professional service layer for AI content generation (prompts and images)
 * Connects to backend /generator routes
 */

import { api } from "./api";

/**
 * Build optimized prompt from brief data
 * Constructs a professional prompt for image generation based on campaign brief
 *
 * @param {Object} briefData - Campaign brief data
 * @param {string} briefData.brief - Main brief description
 * @param {string} [briefData.style='cinematic'] - Visual style preference
 * @param {string} [briefData.dimensions='1024x1024'] - Image dimensions
 * @returns {Promise<string>} Optimized prompt string
 * @throws {Error} If prompt building fails
 *
 * @example
 * const prompt = await buildPrompt({
 *   brief: "Summer campaign for beach wear",
 *   style: "minimalist",
 *   dimensions: "1024x1792"
 * });
 */
export const buildPrompt = async (briefData) => {
  try {
    const payload = {
      brief: briefData.brief || briefData,
      style: briefData.style || "cinematic",
      dimensions: briefData.dimensions || "1024x1024",
    };

    const response = await api.post("/generator/build-prompt", payload);

    // Backend returns { success, data: { prompt } }
    return response.data?.data?.prompt || response.data?.prompt;
  } catch (error) {
    console.error("Error building prompt:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to build prompt. Please try again.",
    );
  }
};

/**
 * Generate images using AI
 * Creates images based on prompt and configuration
 *
 * @param {Object} config - Generation configuration
 * @param {string} config.prompt - Image generation prompt
 * @param {string} config.campaignId - Campaign ID to associate images with
 * @param {string} [config.aspectRatio='1:1'] - Aspect ratio (e.g., '16:9', '1:1', '9:16')
 * @param {number} [config.quantity=1] - Number of images to generate (1-4)
 * @param {boolean} [config.useReference=false] - Use reference images
 * @param {Array<string>} [config.referenceImages] - Reference image URLs if useReference is true
 * @returns {Promise<Object>} Generation result with image URLs
 * @throws {Error} If image generation fails
 *
 * @example
 * const result = await generateImages({
 *   prompt: "Modern minimalist beach scene",
 *   campaignId: "abc123",
 *   aspectRatio: "16:9",
 *   quantity: 2
 * });
 * // Returns: { success: true, data: { assets: [...], metadata: {...} } }
 */
export const generateImages = async (config) => {
  try {
    const payload = {
      prompt: config.prompt,
      campaignId: config.campaignId, // ✅ ADDED: Include campaign ID
      aspectRatio: config.aspectRatio || "1:1",
      sampleCount: config.quantity || 1, // Backend expects 'sampleCount'
      useReference: config.useReference || false,
      referenceImages: config.referenceImages || [],
    };

    const response = await api.post("/generator/generate-images", payload);

    return response.data;
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error?.message ||
        "Failed to generate images. Please try again.",
    );
  }
};

/**
 * Save assets to storage
 * Manually upload and save assets to backend storage
 *
 * @param {Object} saveData - Asset save configuration
 * @param {string} saveData.campaignId - Campaign ID to associate assets with
 * @param {Array<File|string>} saveData.assets - Assets to save (File objects or URLs)
 * @param {Object} [saveData.metadata] - Additional metadata for assets
 * @returns {Promise<Object>} Save result with asset URLs
 * @throws {Error} If saving fails
 *
 * @example
 * const result = await saveAssets({
 *   campaignId: "123",
 *   assets: [fileObject1, fileObject2],
 *   metadata: { category: "social_media" }
 * });
 */
export const saveAssets = async (saveData) => {
  try {
    // If assets are File objects, we need FormData
    const hasFiles = saveData.assets.some((asset) => asset instanceof File);

    if (hasFiles) {
      const formData = new FormData();
      formData.append("campaignId", saveData.campaignId);

      saveData.assets.forEach((asset, index) => {
        if (asset instanceof File) {
          formData.append("assets", asset);
        } else {
          formData.append(`assetUrls[${index}]`, asset);
        }
      });

      if (saveData.metadata) {
        formData.append("metadata", JSON.stringify(saveData.metadata));
      }

      const response = await api.post("/generator/save-assets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } else {
      // All are URLs
      const response = await api.post("/generator/save-assets", {
        campaignId: saveData.campaignId,
        assetUrls: saveData.assets,
        metadata: saveData.metadata,
      });

      return response.data;
    }
  } catch (error) {
    console.error("Error saving assets:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to save assets. Please try again.",
    );
  }
};

/**
 * Refine existing assets using multimodal AI
 * Apply refinements or variations to existing generated assets
 *
 * @param {Array<string>} assetIds - IDs of assets to refine
 * @param {string} refinementPrompt - Instructions for refinement
 * @returns {Promise<Object>} Refined assets data
 * @throws {Error} If refinement fails
 *
 * @example
 * const refined = await refineAsset(
 *   ["asset-id-1", "asset-id-2"],
 *   "Make the colors more vibrant and add sunset lighting"
 * );
 */
export const refineAsset = async (assetIds, refinementPrompt) => {
  try {
    const response = await api.post("/generator/refine-asset", {
      assetIds,
      refinementPrompt,
    });

    return response.data;
  } catch (error) {
    console.error("Error refining asset:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to refine asset. Please try again.",
    );
  }
};

/**
 * Enhanced prompt builder (legacy compatibility)
 * Wrapper around buildPrompt for backward compatibility
 *
 * @deprecated Use buildPrompt instead
 * @param {string|Object} brief - Brief text or object
 * @returns {Promise<string>} Enhanced prompt
 */
export const enhancePrompt = async (brief) => {
  console.warn("enhancePrompt is deprecated. Use buildPrompt instead.");
  return buildPrompt(brief);
};
