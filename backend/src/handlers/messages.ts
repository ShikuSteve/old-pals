
import Message from "../model/messages"
import { DeleteResponse, MessageData } from "../types";

export async function fetchMessagesHandler(room:string){
    if (!room) throw new Error("Room is required");

  return await Message.find({ room }).sort({ createdAt: 1 }).lean();
}

export async function saveMessageHandler(data:MessageData){
    const { senderId, room, content,id,timestamp,type } = data;

    if (!id || !senderId || !timestamp || !type || !content || !room) {
      throw new Error("Missing required fields");
    }
  
    const newMessage = new Message({  id,room, content,senderId,timestamp,type });
    return await newMessage.save();
}

// Delete all messages in a room
export const deleteMessagesHandler = async (msgId: string): Promise<DeleteResponse> => {
  if (!msgId) throw new Error("Message ID required");

  const result = await Message.deleteOne({ id: msgId }); // Match the correct field

  if (result.deletedCount === 0) {
      throw new Error("Message not found");
  }

  return { message: "Message deleted successfully" };
};
