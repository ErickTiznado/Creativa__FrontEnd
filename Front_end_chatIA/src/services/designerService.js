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
