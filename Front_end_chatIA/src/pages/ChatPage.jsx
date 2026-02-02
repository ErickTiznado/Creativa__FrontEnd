import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar.jsx';
import ChatSection from '../components/Chatbox/ChatSection';
import Sidebar from '../components/Chatbox/Sidebar';
import '../components/Chatbox/Chatbox.css';

function ChatPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 800);
    const [briefData, setBriefData] = useState([]);

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

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-layout">
                <ChatSection onToggleSidebar={toggleSidebar} onBriefData={handleBriefData} />
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
