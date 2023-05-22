import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IBlog } from '../Types/interface.js';

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

blogSchema.plugin(paginate);
const blogModel = mongoose.model<IBlog>('blog', blogSchema);
export default blogModel;
