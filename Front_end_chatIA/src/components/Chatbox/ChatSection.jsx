import React from 'react';
import MessageBubble from './MessageBubble';

const chatHistory = [
  { id: 1, sender: 'bot', text: 'Que campaña crearas hoy juan?' },
  { id: 2, sender: 'user', text: 'Campaña de reclutamiento de pasantes.' },
  { id: 3, sender: 'bot', text: 'Que ciudad?' },
  { id: 4, sender: 'user', text: 'San salvador' },
  { id: 5, sender: 'bot', text: 'Perfecto, algun objetivo para esta campaña?' },
  { id: 6, sender: 'user', text: 'Contactar estudiantes de la universidad' },
  { id: 7, sender: 'bot', text: 'Perfecto, eh creado el proyecto "Reclutamiento de pasantes" ahora puedes avanzar a crear tus imágenes para esta campaña!.' },
];

const ChatSection = () => {
  return (
    <section className="chat-section">
      <div className="chat-header-indicator">
        <span className="bot-icon">🤖</span> CHAT
        <span className="sparkles">✨</span>
      </div>
      
      <div className="messages-list">
        {chatHistory.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      <div className="chat-input-area">
        <input type="text" placeholder="Escribe ...." />
        <button className="send-btn">➤</button>
      </div>
    </section>
  );
};

export default ChatSection;
