import { format, isToday, isYesterday } from 'date-fns';
import { Message } from './types';
type GroupedMessages = {
    [key: string]: Message[]; // Key is the date string, value is an array of messages
  };

export const groupMessagesByDate = (messages:Message[]):GroupedMessages => {
    const groupedMessages: GroupedMessages = {};;

  messages.forEach((msg) => {
    const date = new Date(msg.timestamp);
    let dateKey:string;

    if (isToday(date)) {
      dateKey = "Today";
    } else if (isYesterday(date)) {
      dateKey = "Yesterday";
    } else {
      dateKey = format(date, 'MMMM dd, yyyy'); // Format as "January 01, 2023"
    }

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });

  return groupedMessages;
};