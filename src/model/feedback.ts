import mongoose, { Document, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IFeedback } from '../Types/interface.js';

interface FeedbackDocument extends IFeedback, Document {}

const feedbackSchema = new Schema<FeedbackDocument>({
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
const feedbackModel = mongoose.model<FeedbackDocument, mongoose.PaginateModel<FeedbackDocument>>('Feedback', feedbackSchema);
export default feedbackModel;
