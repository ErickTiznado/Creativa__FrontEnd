import { useState, useEffect, useCallback } from "react";
import { getCampaigns, getDesigners, getCampaignById, updateCampaignStatus } from "../services/designerService";

/**
 * Custom hook for fetching and managing the designers list.
 *
 * @returns {Object} Designers state { designers, loading, error }
 */
export const useDesigners = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setLoading(true);
        const data = await getDesigners();
        setDesigners(data || []);
      } catch (err) {
        console.error("Error fetching designers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigners();
  }, []);

  return { designers, loading, error };
};


export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const designerId = localStorage.getItem("user");
        const id = JSON.parse(designerId)
        const data = await getCampaigns(id.id);
        console.log(data, "data")
        setCampaigns(data);
        console.log(campaigns, "campaigns")
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);
  return { campaigns, loading, error, setCampaigns };
}


export const useUpdateCampaignStatus = () => {
  const updateStatus = async (campaignId, status) => {
    try {
      const response = await updateCampaignStatus(campaignId, status);
      console.log(response.data, "response");
      return response;
    } catch (e) {
      console.error("Error updating campaign status:", e);
      throw e;
    }
  };

  return { updateCampaignStatus: updateStatus };
}


export const useCampaignsById = () => {
  const fetchCampaignsById = useCallback(async (id) => {
    try {
      const response = await getCampaignById(id);
      const data = response;
      console.log(data, "response");
      return data;
    } catch (e) {
      console.error("Error fetching campaigns by id:", e);
      throw e;
    }
  }, []); // Empty dependency array as getCampaignById is imported

  return { fetchCampaignsById };
}