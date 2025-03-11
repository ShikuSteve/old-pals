// DeleteMessage.tsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

interface DeleteMessageProps {
  messageId: string; 
  onDelete: (id: string) => void; 
}

const DeleteMessage: React.FC<DeleteMessageProps> = ({ messageId, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          variant="link"
          onClick={() => onDelete(messageId)}
          style={{
            color: "red",
            padding: 0,
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: isHovered ? 1 : 0, // Use opacity instead of display
            transition: "opacity 0.2s ease-in-out", // Smooth transition
          }}
        >
          <Trash />
        </Button>
      </div>
    );
  };
  

export default DeleteMessage;