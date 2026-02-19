import { api as axios } from "./api";

/**
 * Get chat history for a campaign.
 * NOTE: Chat endpoints (/ai/chat/*) are not yet implemented in the hexagonal backend.
 * This will be available after Dev 3 is complete. Returns empty for now.
 */
export const getChatHistoryByCampaignId = async (campaignId) => {
  try {
    const response = await axios.get(`/ai/chat/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    // Graceful degradation: if the route doesn't exist (404), return empty
    if (error.response?.status === 404) {
      console.warn("Chat API not available yet (Dev 3 pending). Returning empty history.");
      return [];
    }
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

/**
 * Update a chat session.
 * NOTE: Not yet implemented — graceful degradation.
 */
export const updateChatSession = async (id, data) => {
  try {
    const response = await axios.put(`/ai/chat/${id}`, data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("Chat API not available yet (Dev 3 pending).");
      return null;
    }
    console.error("Error updating chat session:", error);
    throw error;
  }
};
