type BaseMessage = {
  id: string;
senderId:string,
  // senderEmail: string; 
  timestamp: Date
  room: string;
  receiverId?: string;
};

export type TextMessage = BaseMessage & {
  type: "text";
  content: string;
};

export type ImageMessage = BaseMessage & {
  type: "image";
  content: string; // image data URL or URL after upload
  caption?: string;
};

export type FileMessage = BaseMessage & {
  type: "file";
  content: string; // Use a string for file URL or base64 encoded data
  caption?: string;
};

export type AudioMessage = BaseMessage & {
  type: "audio";
  content: string; // URL or base64 encoded audio data
};

 export type Message = TextMessage | ImageMessage | FileMessage | AudioMessage;

export interface DummyUser {
  email: string;
  _id: string;
  fullName: string;
  lastMessage?: string;
  profilePhoto?: string;
}

export const interestOptions = [
  "Sports",
  "Music",
  "Art",
  "Technology",
  "Travel",
  "Reading",
  "Gaming",
  "Cooking",
  "Fitness",
  "Fashion",
];