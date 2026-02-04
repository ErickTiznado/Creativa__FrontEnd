import { api as axios } from './api';

export const getChatHistoryByCampaignId = async (campaignId) => {
    try {
        const response = await axios.get(`/ai/chat/campaign/${campaignId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};
