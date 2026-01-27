import { createContext, useState, useEffect, Children, useContext } from "react";

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
    const [selectedCamp, setSelectedCamp] = useState(null);


    return (
        <CampaignContext.Provider value={{ selectedCamp, setSelectedCamp }}>
            {children}
        </CampaignContext.Provider >
    )
}


export const useCampaignsContext = () => {
    const context = useContext(CampaignContext);
    if (!context) {
        throw new Error('useCampaignsContext must be used within a CampaignProvider')
    }
    return context
}