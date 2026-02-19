import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { generateImages } from "../services/generatorService";
import { useCampaignsContext } from "./useCampaignsContext";
import { getAllAssets, deleteAsset } from "../services/assetService";
import { useCampaignsById } from "./useDesigners";

export const useCampaignWorkspace = () => {
  const { campaignId } = useParams();
  const { selectedCamp, setSelectedCamp } = useCampaignsContext();
  const { fetchCampaignsById } = useCampaignsById();

  // --- NORMALIZACIÓN DE DATOS ---
  // Aseguramos que 'campaign' sea siempre un objeto o null
  const campaign = Array.isArray(selectedCamp) ? selectedCamp[0] : selectedCamp;
  const brief = campaign?.brief_data;

  // --- MOCK DATA / DEFAULT DATA ---
  // Si no hay campaña real, usamos estos datos por defecto
  const defaultCampaignData = {
    designer: "Juan Carlos",
    title: "Campaña de reclutamiento de pasantes",
    status: "En proceso",
    details: {
      objective: "Contactar estudiantes de diseño para pasantías de verano.",
      channel: "Instagram, LinkedIn",
      public: "Universitarios 18-24 años",
      date: "12 de Octubre, 2023",
      description: "Se requiere un estilo visual dinámico y juvenil.",
    },
    tags: [
      "Reclutamiento",
      "Oficina",
      "Jóvenes",
      "Tecnología",
      "Verano",
      "Equipo",
    ],
    repoImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  };

  // Construimos el objeto de datos final mezclando el real con el fallback
  const campaignData = campaign
    ? {
      designer: "Juan Carlos", // Placeholder, podría venir del contexto de usuario
      title: brief?.nombre_campaing || "Sin título",
      status: campaign.status === "draft" ? "En Proceso" : campaign.status,
      details: {
        objective: brief?.Objective || "No especificado",
        channel: brief?.publishing_channel || "No especificado",
        public: "General",
        date: brief?.fechaPublicacion || "No especificada",
        description: brief?.Description || "Sin descripción",
      },
      tags: brief?.ContentType ? [brief.ContentType] : ["General"],
      repoImages: [], // Ya no usamos esto para renderizar, sino 'assets'
    }
    : defaultCampaignData;

  // --- ESTADOS DE UI ---
  const [activeTab, setActiveTab] = useState("Repositorio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- ESTADOS REPOSITORIO ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  /* --- ESTADOS GENERADOR --- */
  const [prompt, setPrompt] = useState(
    "Jóvenes universitarios, en oficina moderna, participando en Reunión...",
  );
  const [style, setStyle] = useState("cinematic"); // Default style
  const [useReference, setUseReference] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quantity, setQuantity] = useState(2);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // --- ESTADOS EDICIÓN ---
  const [activeEdit, setActiveEdit] = useState("Solicitud");
  const [selectedImg, setSelectedImg] = useState([]);
  const [textEdit, setTextEdit] = useState("");
  const [selectedSaveImg, setSelectedSaveImg] = useState([]);

  // --- EFECTOS ---

  // 1. Responsive Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 950) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // Check init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Recovery: Fetch campaign if not in context but we have campaignId in URL
  useEffect(() => {
    const recoverCampaign = async () => {
      // Always re-fetch if we have an ID to ensure fresh data (including assets)
      if (campaignId) {
        try {

          const data = await fetchCampaignsById(campaignId);
          setSelectedCamp(data);
        } catch (error) {
          console.error("Error recovering campaign:", error);
        }
      }
    };

    recoverCampaign();
  }, [campaignId, fetchCampaignsById, setSelectedCamp]);

  // 3. Sync Generated Images with Campaign Data
  // When campaign updates, sync generated images from the campaign object
  useEffect(() => {
    if (campaign && campaign.assets) {



      // Filter logic: Only show Parent images (those without parent_asset_id)
      // The refinements (children) will be accessed separately when editing
      const parentImages = campaign.assets.filter(
        (asset) => !asset.parent_asset_id,
      );

      // Update generated images for the generator history
      setGeneratedImages(parentImages);
    }
  }, [campaign]);

  // 4. Load All Assets for Repository
  useEffect(() => {
    const loadRepoAssets = async () => {
      if (!campaign?.id) return; // Wait for campaign ID
      try {
        setLoadingAssets(true);
        // Load ALL assets for the repository view, as requested
        const allAssets = await getAllAssets(campaign.id);
        setAssets(allAssets || []);
      } catch (error) {
        console.error("Error loading repository assets:", error);
      } finally {
        setLoadingAssets(false);
      }
    };

    loadRepoAssets();
  }, [campaign]); // Dependency on campaign (specifically id)

  // --- HELPERS ---

  // Get all refinement images (children) for a given parent asset ID
  const getRefinements = (parentId) => {
    if (!campaign || !campaign.assets) return [];
    return campaign.assets.filter(
      (asset) => asset.parent_asset_id === parentId,
    );
  };

  // --- HANDLERS ---

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectionImg = (index) => {
    if (selectedImg.includes(index)) {
      setSelectedImg([]);
    } else {
      setSelectedImg([index]);
    }
  };

  const toggleSaveImg = (index) => {
    if (selectedSaveImg.includes(index)) {
      setSelectedSaveImg(selectedSaveImg.filter((itemId) => itemId !== index));
    } else {
      setSelectedSaveImg([...selectedSaveImg, index]);
    }
  };

  /**
   * Real image generation using backend API
   */
  const handleGenerate = async () => {
    if (!prompt || prompt.trim().length === 0) {
      setGenerationError("Por favor ingresa un prompt");
      return;
    }

    // Validate that we have a campaign ID
    if (!campaign?.id) {
      setGenerationError("No hay campaña seleccionada");
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);

      // Get reference image URLs if useReference is enabled
      const referenceImages = useReference
        ? assets
          .filter((asset) => selectedIds.includes(asset.id))
          .map((asset) =>
            typeof asset.img_url === "string"
              ? asset.img_url
              : asset.img_url?.url,
          )
        : [];

      // Call the backend to generate images
      const result = await generateImages({
        prompt: prompt,
        style: style, // ✅ ADDED: Send style state
        aspectRatio: aspectRatio,
        quantity: quantity,
        useReference: useReference,
        referenceImages: referenceImages,
        campaignId: campaign.id,
        brandId: campaignData?.brandId // Pass brandId if available
      });

      // Extract image URLs from the result
      // Backend returns an array of asset objects directly: [{ id, img_url, ... }, ...]
      const assetObjects = Array.isArray(result) ? result : (result.data?.assets || result.assets || []);

      // Store complete asset objects (not just URLs) for inpainting
      // Each asset has: { id, img_url, prompt_used, campaign_assets, ... }
      if (assetObjects.length > 0) {

        setGeneratedImages([...generatedImages, ...assetObjects]);
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

  const handleGenerateEdit = () => {
    // Lógica futura para editar

  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await deleteAsset(assetId);

      // Update assets state
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.id !== assetId),
      );

      // Also update generatedImages if the deleted asset was in there
      setGeneratedImages((prevImages) =>
        prevImages.filter((img) => img.id !== assetId),
      );

      // Remove from selectedIds if it was selected
      if (selectedIds.includes(assetId)) {
        setSelectedIds((prevIds) => prevIds.filter((id) => id !== assetId));
      }

      return true;
    } catch (error) {
      console.error("Error handling delete asset:", error);
      throw error;
    }
  };

  return {
    // Data
    campaignData,
    campaign, // Campaign object with ID

    // UI State
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,

    // Repository State
    assets,
    loadingAssets,
    selectedIds,
    toggleSelection,

    // Generator State
    prompt,
    setPrompt,
    style,
    setStyle,
    useReference,
    setUseReference,
    aspectRatio,
    setAspectRatio,
    quantity,
    setQuantity,
    generatedImages,
    handleGenerate,
    isGenerating,
    generationError,

    // Edit State
    activeEdit,
    setActiveEdit,
    selectedImg,
    toggleSelectionImg,
    textEdit,
    setTextEdit,
    selectedSaveImg,
    toggleSaveImg,
    handleGenerateEdit,
    getRefinements, // Helper to get children images
    handleDeleteAsset,
  };
};
