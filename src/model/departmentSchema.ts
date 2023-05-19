import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface IDept {
  name: string;
}

const departmentSchema = new Schema<IDept>({
  name: {
    type: String,
    required: true,
  },
});

departmentSchema.plugin(paginate);
const departmentModel = mongoose.model<IDept>('department', departmentSchema);
export default departmentModel;
