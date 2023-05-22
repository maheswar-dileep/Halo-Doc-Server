import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IDoctor } from '../Types/interface.js';

const doctorSchema = new Schema<IDoctor>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    requied: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  workTime: {
    type: String,
    required: true,
  },
  fees: {
    type: String,
    required: true,
  },
  leave: {
    type: [String],
  },
  password: {
    type: String,
    required: true,
  },
});

doctorSchema.plugin(paginate);
const doctorModel = mongoose.model<IDoctor>('doctor', doctorSchema);
export default doctorModel;
