import mongoose, { Document, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IBlog } from '../Types/interface.js';

interface BlogDocument extends IBlog, Document {}

const blogSchema = new Schema<BlogDocument>({
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
const blogModel = mongoose.model<BlogDocument, mongoose.PaginateModel<BlogDocument>>('Blog', blogSchema);
export default blogModel;
