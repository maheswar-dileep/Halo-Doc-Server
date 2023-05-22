import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../Types/interface.js';

const conversationSchema = new Schema<IConversation>(
  {
    members: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const conversationModel = mongoose.model<IConversation>('conversation', conversationSchema);
export default conversationModel;
