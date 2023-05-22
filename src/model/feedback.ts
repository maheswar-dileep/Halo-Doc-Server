import mongoose, { Schema, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IFeedback } from '../Types/interface.js';

const feedbackSchema = new Schema<IFeedback>({
  doctorId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
  },
});

feedbackSchema.plugin(paginate);
const feedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);
export default feedbackModel;
