import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../Types/interface.js';

const messageSchema = new Schema<IMessage>(
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
