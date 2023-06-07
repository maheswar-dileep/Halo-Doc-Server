import mongoose, { Document, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IReportDoctor } from '../Types/interface.js';

interface ReportDocument extends IReportDoctor, Document {}

const reportDoctorSchema = new Schema<ReportDocument>({
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
