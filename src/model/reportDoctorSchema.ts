import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IReportDoctor } from '../Types/interface.js';

const reportDoctorSchema = new Schema<IReportDoctor>({
  doctorId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

reportDoctorSchema.plugin(paginate);
const reportDoctorModel = mongoose.model<IReportDoctor>('ReportDoctor', reportDoctorSchema);
export default reportDoctorModel;
