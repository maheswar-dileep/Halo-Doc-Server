import mongoose, { Document, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IDept } from '../Types/interface.js';

interface DepartmentDocument extends IDept, Document {}

const departmentSchema = new Schema<DepartmentDocument>({
  name: {
    type: String,
    required: true,
  },
});

departmentSchema.plugin(paginate);
const departmentModel = mongoose.model<IDept>('department', departmentSchema);
export default departmentModel;
