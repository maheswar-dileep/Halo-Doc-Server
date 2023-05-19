import mongoose, { Schema } from 'mongoose';

interface IConversation {
  members: Array<string>;
}

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
