import { api } from "./api";

export const getDesigners = async () => {
  const response = await api.get("/profile/designers");
  return response.data;
};

export const sendCampaign = async (campaign) => {
  try {
    const payload = {
      user_id: campaign.user_id,
      data: campaign.briefData, // Backend expects 'data' key for brief_data
      idCampaing: campaign.brief_id, // Backend expects 'idCampaing' if updating
      designer_id: campaign.designer_id,
    };

    // Remove undefined keys to keep payload clean
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    const response = await api.post("/campaigns/registerCampaigns", payload);
    return response;
  } catch (e) {
    console.error("Error in sendCampaign:", e);
    throw e;
  }
};

export const getCampaigns = async (designerId) => {

  try {
    const response = await api.get(`/campaigns/designers`, {
      params: { designerId },
    });

    return response.data.data;
  } catch (e) {
    console.error("Error in getCampaigns:", e);
    throw e;
  }
};

export const updateCampaignStatus = async (campaignId, status) => {
  try {
    const response = await api.put("/campaigns/updateStateCampaign", {
      campaignId,
      status,
    });

    return response;
  } catch (e) {
    console.error("Error in updateCampaignStatus:", e);
    throw e;
  }
};

export const getCampaignById = async (campaignId) => {
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user).id;
  try {
    const response = await api.get("/campaigns/campaignById", {
      params: { campaignId, designerId: userId },
    });

    return response.data.data;
  } catch (e) {
    console.error("Error in getCampaignById:", e);
    throw e;
  }
};
