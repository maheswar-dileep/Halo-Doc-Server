import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  symptoms: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Boolean,
    default: true,
  },
});

const appointmentModel = mongoose.model('appointment', appointmentSchema);
export default appointmentModel;
