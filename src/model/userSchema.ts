import mongoose, { Document, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IUser } from '../Types/interface.js';

interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileURL: {
    type: String,
    required: true,
  },
  prescription: {
    type: [Object],
  },
});

userSchema.plugin(paginate);
const userModel = mongoose.model<UserDocument, mongoose.PaginateModel<UserDocument>>('user', userSchema);
export default userModel;
