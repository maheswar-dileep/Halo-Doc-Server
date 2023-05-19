import mongoose, { Schema, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface IReportDoctor {
  doctorId: Types.ObjectId;
  userId: Types.ObjectId;
  reason: string;
}

const reportDoctorSchema = new Schema<IReportDoctor>({
  doctorId: {
    type: Types.ObjectId,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
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
