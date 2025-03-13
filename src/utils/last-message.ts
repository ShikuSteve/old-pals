import { Message } from "./types";

export const getLastMessagePreview = (message?: Message): string => {
    if (!message) return 'No messages yet';
    
    switch (message.type) {
      case 'text':
        return message.content;
      case 'image':
        return '📷 Photo';
      case 'audio':
        return '🎤 Audio message';
      case 'file':
        return `📁 ${message.caption?.split('\n')[0] || 'File'}`;
      default:
        return 'New message';
    }
  };