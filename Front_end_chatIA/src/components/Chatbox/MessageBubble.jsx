import { CircleUser } from 'lucide-react';
import React from 'react';


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ sender, text }) => {
  const isBot = sender === 'bot';
  return (
    <div className={`message-row ${isBot ? 'msg-bot' : 'msg-user'}`}>
      {isBot && <div className="">{/*<img src={logoChatbox} alt="Bot" />*/}</div>}
      <div className="bubble markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
      {!isBot && <div className="avatar user-avatar"><CircleUser size={30} /></div>}
    </div>
  );
};

export default MessageBubble;
