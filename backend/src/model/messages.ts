import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  id: { type: String, required: true, unique: true }, // Ensure uniqueness for messages
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Renamed to match handler
  receiver: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional if room is used
  room: { type: String, required: true }, // Room identifier for group chats or conversations
  content: { type: String, required: true },
  type: { type: String, required: true }, // Message type (text, image, etc.)
  timestamp: { type: Date, required: true }, // Ensure messages have a timestamp
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);

export default Message;
