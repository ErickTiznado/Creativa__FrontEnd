import { Send, Menu, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useEffect, useRef } from 'react';

/**
 * ChatSection - Main chat interface component.
 * Uses the useChatMessages hook for all chat logic.
 * 
 * @param {Function} onToggleSidebar - Callback to toggle sidebar visibility
 * @param {Function} onBriefData - Callback when brief data is received
 * @param {Function} onTypeChange - Callback when chat type changes
 */
const ChatSection = ({ onToggleSidebar, onBriefData, onTypeChange }) => {
  const {
    messages,
    isLoading,
    inputText,
    type,
    handleInputChange,
    sendMessage
  } = useChatMessages(onBriefData);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Notify parent when type changes
  useEffect(() => {
    if (type && onTypeChange) {
      onTypeChange(type);
    }
  }, [type, onTypeChange]);

  return (
    <section className="chat-section">
      <div className="chat-header-indicator">
        <div className='bot-header'>
          <Sparkles className="bot-icon" size={24} />
          <span>CHAT</span>
        </div>
        <div className="header-actions">
          <button className="toggle-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <Menu />
          </button>
        </div>
      </div>

      <div className="messages-list">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading ? (
          <div className='message-row msg-bot'>
            <div className='bubble typing-indicator'>
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={inputText}
          placeholder="Escribe ...."
          onChange={handleInputChange}
          disabled={isLoading}
          aria-label="Escribe tu mensaje"
        />
        <button className="send-btn" type="submit" aria-label="Enviar mensaje">
          <Send />
        </button>
      </form>
    </section>
  );
};

export default ChatSection;
