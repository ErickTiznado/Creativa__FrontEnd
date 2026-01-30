import { useContext } from "react";
import CampaignContext from "../context/CampaignContextValue";

export const useCampaignsContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignsContext must be used within a CampaignProvider",
    );
  }
  return context;
};
