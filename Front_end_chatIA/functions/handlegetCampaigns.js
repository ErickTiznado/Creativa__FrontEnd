import axios from "axios";

export let campaigns = [];

export const handleGetCampaigns = async () => {
  try {
    // Apuntamos a la nueva ruta hexagonal
    const response = await axios.get("http://localhost:3000/campaigns/all");
    campaigns = response.data;
    return response.data;
  } catch (e) {
    console.error("Error fetching campaigns:", e);
    // Retornamos una estructura vacía segura para que React no crashee
    return { success: false, data: [] };
  }
};