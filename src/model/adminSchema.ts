import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
interface IAdmin {
  name: string;
  email: string;
  password: string;
}
const adminSchema = new Schema<IAdmin>({
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

const adminModel = mongoose.model<IAdmin>('admin', adminSchema);
export default adminModel;
