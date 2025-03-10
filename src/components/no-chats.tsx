
import React from 'react';
import chat from "../assets/reconnect.jpg"

const NoChatsMessage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        No Chats Yet
      </h2>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        Start a conversation with your friends to rekindle your memories!
      </p>
      <img
        src={chat} 
        alt="No Chats"
        style={{ width: '200px', height: '200px', marginBottom: '20px' }}
      />
      <p style={{ fontSize: '16px' }}>
        Start Chart!
      </p>
    </div>
  );
};

export default NoChatsMessage;