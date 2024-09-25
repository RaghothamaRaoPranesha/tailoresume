import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
  originalResume: { type: String, required: true },
  tailoredResume: { type: String, required: true },
  jobDescription: { type: String, required: true },
  fileUri: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', ChatSchema);
export default Chat