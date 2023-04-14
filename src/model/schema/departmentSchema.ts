import mongoose, { Schema } from 'mongoose';

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const departmentModel = mongoose.model('department', departmentSchema);
export default departmentModel;
