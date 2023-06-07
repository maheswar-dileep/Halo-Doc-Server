import mongoose, { Document, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IAdmin } from '../Types/interface.js';

interface AdminDocument extends IAdmin, Document {}

const adminSchema = new Schema<AdminDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.plugin(paginate);

const adminModel = mongoose.model<AdminDocument, mongoose.PaginateModel<AdminDocument>>('admin', adminSchema);
export default adminModel;
