import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar.jsx';
import ChatSection from '../components/Chatbox/ChatSection';
import Sidebar from '../components/Chatbox/Sidebar';
import '../components/Chatbox/Chatbox.css'; // Importar CSS compartido

function ChatPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 800);

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

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-layout">
                <ChatSection onToggleSidebar={toggleSidebar} />
                {isSidebarOpen && <Sidebar className={window.innerWidth <= 800 ? 'open' : ''} onToggle={toggleSidebar} />}
            </main>
        </div>
    );
}

export default ChatPage;
