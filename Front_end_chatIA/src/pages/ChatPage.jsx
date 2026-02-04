import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar.jsx';
import ChatSection from '../components/Chatbox/ChatSection';
import Sidebar from '../components/Chatbox/Sidebar';
import '../components/Chatbox/Chatbox.css';
import { getDrafts } from '../services/draftService.js';
import { getChatHistoryByCampaignId } from '../services/chatService.js';
import sessionContext from "../context/SessionContextValue";

function ChatPage() {
    const { draftId } = useParams();
    const { setActiveDraft } = useContext(sessionContext);

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 800);
    const [briefData, setBriefData] = useState([]);
    const [initialMessages, setInitialMessages] = useState([]);
    const [loadingDraft, setLoadingDraft] = useState(!!draftId); // Loading if there is a draftId

    useEffect(() => {
        const loadDraft = async () => {
            if (draftId) {
                const drafts = getDrafts();
                const foundDraft = drafts.find(d => d.id === draftId);

                if (foundDraft) {
                    setActiveDraft(draftId);
                    if (foundDraft.messages) setInitialMessages(foundDraft.messages);
                    if (foundDraft.data) handleBriefData(foundDraft.data);
                } else {
                    // Try fetching from API
                    try {
                        const apiChat = await getChatHistoryByCampaignId(draftId);
                        if (apiChat && apiChat.length > 0) {
                            const session = apiChat[0]; // Assuming array response
                            setActiveDraft(draftId);
                            // Ensure messages are valid array
                            if (session.chat && Array.isArray(session.chat)) {
                                setInitialMessages(session.chat);
                            }
                            // If there is brief data (campaigns/brief might be separate, but let's check)
                            // For now, we mainly want to see the chat. 
                        }
                    } catch (error) {
                        console.error("Failed to load chat from API:", error);
                        // Optionally show error or just empty state
                    }
                }
            } else {
                setActiveDraft(null);
            }
            setLoadingDraft(false);
        };

        loadDraft();
    }, [draftId, setActiveDraft]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 800) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleBriefData = (newData) => {
        // Convertir objeto plano { key: value } a array de { label, value }
        setBriefData((prevBriefData) => {
            const updatedData = [...prevBriefData];

            Object.entries(newData).forEach(([key, value]) => {
                if (value && value !== "") {
                    const existingIndex = updatedData.findIndex(item => item.label === key);

                    if (existingIndex !== -1) {
                        updatedData[existingIndex].value = value;
                    } else {
                        updatedData.push({ label: key, value: value });
                    }
                }
            });
            return updatedData;
        });
    };

    // Prevent rendering ChatSection until draft is loaded to avoid empty initialMessages race condition
    if (loadingDraft) return <div className="app-container"><Navbar /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white' }}>Cargando historial...</div></div>;

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-layout">
                <ChatSection
                    onToggleSidebar={toggleSidebar}
                    onBriefData={handleBriefData}
                    initialMessages={initialMessages}
                />
                {isSidebarOpen && <Sidebar
                    briefData={briefData}
                    className={window.innerWidth <= 800 ? 'open' : ''}
                    onToggle={toggleSidebar}
                />}
            </main>
        </div>
    );
}

export default ChatPage;
