import mongoose, { Schema, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface IFeedback {
  doctorId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  feedback: string;
}

const feedbackSchema = new Schema<IFeedback>({
  doctorId: {
    type: Types.ObjectId,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
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
