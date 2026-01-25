import { FaPaperPlane, FaBars } from 'react-icons/fa';
import logoChatbox from '../../assets/img/logoChatbox.png';
import MessageBubble from './MessageBubble';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useEffect } from 'react';

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
          <img className="bot-icon" src={logoChatbox} alt="Chat Logo" />
          <span>CHAT</span>
        </div>
        <div className="header-actions">
          <button className="toggle-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <FaBars />
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
          <FaPaperPlane />
        </button>
      </form>
    </section>
  );
};

export default ChatSection;
