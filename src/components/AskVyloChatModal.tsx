import React from 'react';
import { AskZyroChatModal } from './AskZyroChatModal';

interface AskVyloChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

// Forward to ZYRO AI Modal
export const AskVyloChatModal: React.FC<AskVyloChatModalProps> = (props) => {
  return <AskZyroChatModal {...props} />;
};

export { AskZyroChatModal };
