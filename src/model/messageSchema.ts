import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema(
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
  }
);

const messageModel = mongoose.model('message', messageSchema);
export default messageModel;
