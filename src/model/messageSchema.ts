import mongoose, { Document, Schema } from 'mongoose';
import { IMessage } from '../Types/interface.js';

interface MessageDocument extends IMessage, Document {}

const messageSchema = new Schema<MessageDocument>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const messageModel = mongoose.model<IMessage>('message', messageSchema);
export default messageModel;
