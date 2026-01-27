import axios from "axios";

export let campaigns = [];

export const handleGetCampaigns = async () => {
  try {
    const response = await axios.get("http://localhost:3000/campaigns");
    campaigns = response.data;
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
