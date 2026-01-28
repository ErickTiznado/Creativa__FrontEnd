import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCampaignsContext } from '../context/CampaignContext';

export const useCampaignWorkspace = () => {
    const { selectedCamp } = useCampaignsContext();

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
            description: "Se requiere un estilo visual dinámico y juvenil."
        },
        tags: ["Reclutamiento", "Oficina", "Jóvenes", "Tecnología", "Verano", "Equipo"],
        repoImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };

    // Construimos el objeto de datos final mezclando el real con el fallback
    const campaignData = campaign ? {
        designer: "Juan Carlos", // Placeholder, podría venir del contexto de usuario
        title: brief?.nombre_campaing || "Sin título",
        status: campaign.status === 'draft' ? "En Proceso" : campaign.status,
        details: {
            objective: brief?.Objective || "No especificado",
            channel: brief?.publishing_channel || "No especificado",
            public: "General",
            date: brief?.fechaPublicacion || "No especificada",
            description: brief?.Description || "Sin descripción"
        },
        tags: brief?.ContentType ? [brief.ContentType] : ["General"],
        repoImages: [] // Ya no usamos esto para renderizar, sino 'assets'
    } : defaultCampaignData;


    // --- ESTADOS DE UI ---
    const [activeTab, setActiveTab] = useState('Repositorio');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- ESTADOS REPOSITORIO ---
    const [selectedIds, setSelectedIds] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);

    // --- ESTADOS GENERADOR ---
    const [prompt, setPrompt] = useState("Jóvenes universitarios, en oficina moderna, participando en Reunión...");
    const [useReference, setUseReference] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("1:1 cuadrado");
    const [quantity, setQuantity] = useState(2);
    const [generatedImages, setGeneratedImages] = useState([]);

    // --- ESTADOS EDICIÓN ---
    const [activeEdit, setActiveEdit] = useState('Solicitud');
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
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. Fetch Assets
    useEffect(() => {
        const fetchAssets = async () => {
            if (!campaign?.id) return;

            try {
                setLoadingAssets(true);
                const response = await axios.get('http://localhost:3000/assets');
                if (response.data && response.data.success) {
                    // Cargar TODAS las imágenes (sin filtrar por campaña)
                    setAssets(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching assets:", error);
            } finally {
                setLoadingAssets(false);
            }
        };

        if (campaign) {
            fetchAssets();
        }
    }, [campaign]);


    // --- HANDLERS ---

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
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
            setSelectedSaveImg(selectedSaveImg.filter(itemId => itemId !== index));
        } else {
            setSelectedSaveImg([...selectedSaveImg, index]);
        }
    };

    const handleGenerate = () => {
        const newImages = Array.from({ length: quantity }, (_, i) => `Generated IMG ${generatedImages.length + i + 1}`);
        setGeneratedImages([...generatedImages, ...newImages]);
        // Stay in Generador tab - images will appear in GeneratorView canvas
    };

    const handleGenerateEdit = () => {
        // Lógica futura para editar 
        console.log("Generando edición/variación...");
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
        prompt, setPrompt,
        useReference, setUseReference,
        aspectRatio, setAspectRatio,
        quantity, setQuantity,
        generatedImages,
        handleGenerate,

        // Edit State
        activeEdit, setActiveEdit,
        selectedImg, toggleSelectionImg,
        textEdit, setTextEdit,
        selectedSaveImg, toggleSaveImg,
        handleGenerateEdit
    };
};
