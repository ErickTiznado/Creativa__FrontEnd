import axios from 'axios';

const API_URL = 'http://localhost:3000/api/generator'; // Adjust base URL if needed

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const refineAsset = async (assetIds, refinementPrompt) => {
    try {
        const response = await axios.post(`${API_URL}/refine-asset`, {
            assetIds,
            refinementPrompt
        }, getHeaders());

        return response.data;
    } catch (error) {
        console.error('Error refining asset:', error);
        throw error;
    }
};

export const generateImages = async (prompt, aspectRatio, quantity = 1, useReference = false) => {
    // This function likely mirrors existing functionality but centralizes it
    // Implementation would depend on existing endpoints, keeping placeholder for now if needed by refactor
    // For now assuming the View handles generation via existing means, or we migrate here.
    return { success: false, message: "Use existing method for now" };
};
