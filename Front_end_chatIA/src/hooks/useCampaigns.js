import { useState, useEffect, useCallback } from 'react';
import { handleGetCampaigns } from "../../functions/handlegetCampaigns.js";
import { getDrafts } from '../services/draftService.js';

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Local Drafts
            const localDrafts = getDrafts().map(d => ({
                id: d.id,
                status: 'chat_draft',
                isLocalDraft: true,
                brief_data: {
                    nombre_campaing: d.preview || "Nuevo Chat",
                    fechaPublicacion: new Date(d.lastActive).toLocaleDateString()
                }
            }));

            // 2. Fetch API Campaigns
            try {
                const result = await handleGetCampaigns();
                let apiCampaigns = [];

                if (result.success) {
                    apiCampaigns = result.data || [];
                } else {
                    console.error("Failed to fetch campaigns:", result.message);
                }
                // 3. Merge Both
                setCampaigns([...localDrafts, ...apiCampaigns]);

            } catch (apiError) {
                console.error("API Error:", apiError);
                // Still show drafts if API fails
                setCampaigns([...localDrafts]);
            }

        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    return { campaigns, loading, error, refreshCampaigns: fetchCampaigns };
};
