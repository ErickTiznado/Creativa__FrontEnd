import React from 'react';
import './Chatbox.css';
import ChatSection from './ChatSection';
import Sidebar from './Sidebar';

function Chatbox({ onClose }) {
    return (
        <div className="chatbox-overlay">
            <div className="chatbox-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="app-container">
                    <main className="main-layout">
                        <ChatSection />
                        <Sidebar />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Chatbox;
