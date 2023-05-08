import mongoose, { Schema } from 'mongoose';

const doctorSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
});

const doctorModel = mongoose.model('doctor', doctorSchema);
export default doctorModel;
