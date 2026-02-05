import { api as axios } from "./api";

export const getChatHistoryByCampaignId = async (campaignId) => {
  try {
    const response = await axios.get(`/ai/chat/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const updateChatSession = async (id, data) => {
  try {
    const response = await axios.put(`/ai/chat/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating chat session:", error);
    throw error;
  }
};
