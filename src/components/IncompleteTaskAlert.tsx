import React from 'react';
import { DailyQuest } from '../types';
import { SmartMotivationalNotifications } from './SmartMotivationalNotifications';

interface IncompleteTaskAlertProps {
  quests: DailyQuest[];
  onCompleteQuest: (id: string) => void;
  onOpenZyroChat: (prompt?: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

/**
 * IncompleteTaskAlert now routes to SmartMotivationalNotifications
 * ensuring friendly, engaging, emotional reminders without emergency alert symbols.
 */
export const IncompleteTaskAlert: React.FC<IncompleteTaskAlertProps> = (props) => {
  return <SmartMotivationalNotifications {...props} />;
};

export default IncompleteTaskAlert;
