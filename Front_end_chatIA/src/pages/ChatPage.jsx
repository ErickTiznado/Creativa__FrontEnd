import React from 'react';
import ChatSection from '../components/Chatbox/ChatSection';
import Sidebar from '../components/Chatbox/Sidebar';
import '../components/Chatbox/Chatbox.css'; // Importar CSS compartido

function ChatPage() {
    return (
        <div className="app-container">
            {/* <Header /> */}
            <main className="main-layout">
                <ChatSection />
                <Sidebar />
            </main>
        </div>
    );
}

export default ChatPage;
