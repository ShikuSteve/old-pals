import { Date } from "mongoose";

export type AddFriendInput = {
    userId: string;
    friendId: string;
  };
  
 
  export type AddFriendOutput = {
    message: string;
  };

  export interface ProfileData {
    age?: number;
    email?: string;
    fullName?: string;
    school?: string;
    country?: string;
    hometown?: string;
    interest?: string;
    profilePhoto?: string;
  }
  
  // Define the function input type
  export interface UserProfileInput {
    userId: string;
    profileData: ProfileData;
  }
export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer?: Buffer;
  }
  
  export interface MessageData {
    senderId: string;
    room: string;
    content: string;
    id:string
    timestamp:Date
    type:"text"|"image"|"file"|"audio"
  }
  
  export interface MessageResponse {
    _id: string;
    sender: string;
    room: string;
    content: string;
    createdAt: Date;
  }
  
  export interface DeleteResponse {
    message: string;
  }
  