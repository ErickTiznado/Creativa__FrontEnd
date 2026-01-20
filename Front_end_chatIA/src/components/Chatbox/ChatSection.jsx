import { FaPaperPlane, FaPlane, FaBars } from 'react-icons/fa';
import logoChatbox from '../../assets/img/logoChatbox.png';
import MessageBubble from './MessageBubble';
import { handlesend } from '../../../functions/handlesend.js';
import { useState } from 'react';






const ChatSection = ({ onToggleSidebar, onBriefData }) => {

  const [message, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMsg = { sender: 'user', text: inputText }

    setMessage((prevMessage) => [...prevMessage, userMsg]);

    setInputText('');
    setIsLoading(true);

    try {
      const response = await handlesend(inputText);

      if (response.success === true) {
        const botMsg = { sender: 'bot', text: response.response }
        setMessage((prevMessage) => [...prevMessage, botMsg]);

      }
      else {
        const botMsg = { sender: 'bot', text: 'Error al procesar la solicitud' }
        setMessage((prevMessage) => [...prevMessage, botMsg]);
      }
    } catch (error) {
      console.error('Error en handleSendMessage:', error);
      const botMsg = { sender: 'bot', text: 'Error de conexión. Intenta de nuevo.' }
      setMessage((prevMessage) => [...prevMessage, botMsg]);
    } finally {
      setIsLoading(false);
    }
  }


  const handleOnChange = (e) => {
    setInputText(e.target.value)
  }

  return (
    <section className="chat-section">
      <div className="chat-header-indicator">
        <div className='bot-header'>
          <img className="bot-icon" src={logoChatbox} alt="Chat Logo" />
          <span>CHAT</span>
        </div>
        <div className="header-actions">
          <button className="toggle-btn" onClick={onToggleSidebar}>
            <FaBars />
          </button>
        </div>
      </div>

      <div className="messages-list">
        {message.map((msg, index) => (
          <MessageBubble key={index} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading === true && <div className='message-row msg-bot'>
          <div className='bubble'>
            Escribiendo...
          </div>
        </div>}
      </div>

      <div className="chat-input-area">
        <input type="text" value={inputText} placeholder="Escribe ...." onChange={handleOnChange} />
        <button className="send-btn" onClick={handleSendMessage}><FaPaperPlane /></button>
      </div>
    </section>
  );
};

export default ChatSection;
