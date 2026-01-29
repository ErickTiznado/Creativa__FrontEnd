import { createContext, useState, useEffect, Children, useContext } from "react";

const CampaignContext = createContext(null);

const STORAGE_KEY = 'selectedCampaign';

export const CampaignProvider = ({ children }) => {
    // Initialize from localStorage if available
    const [selectedCamp, setSelectedCamp] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading campaign from localStorage:', error);
            return null;
        }
    });

    // Save to localStorage whenever selectedCamp changes
    useEffect(() => {
        try {
            if (selectedCamp) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCamp));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.error('Error saving campaign to localStorage:', error);
        }
    }, [selectedCamp]);

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