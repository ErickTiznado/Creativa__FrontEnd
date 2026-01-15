import React from 'react';

const MessageBubble = ({ sender, text }) => {
  const isBot = sender === 'bot';
  return (
    <div className={`message-row ${isBot ? 'msg-bot' : 'msg-user'}`}>
      {isBot && <div className="avatar bot-avatar">🤖</div>}
      <div className="bubble">
        {text}
      </div>
      {!isBot && <div className="avatar user-avatar"><img src="https://i.pravatar.cc/150?img=11" alt="user" /></div>}
    </div>
  );
};

export default MessageBubble;
