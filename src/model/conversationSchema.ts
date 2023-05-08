import mongoose, { Schema } from 'mongoose';

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const conversationModel = mongoose.model('conversation', conversationSchema);
export default conversationModel;
