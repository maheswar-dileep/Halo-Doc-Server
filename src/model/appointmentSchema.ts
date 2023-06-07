import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IAppointment } from '../Types/interface.js';

const appointmentSchema = new Schema<IAppointment>({
  userId: {
    type: String,
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
    type: [String],
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
    type: String,
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
  active: {
    type: Boolean,
    default: true,
  },
  payment_intent: {
    type: String,
  },
});

appointmentSchema.plugin(paginate);

const appointmentModel = mongoose.model<IAppointment>('appointment', appointmentSchema);
export default appointmentModel;
