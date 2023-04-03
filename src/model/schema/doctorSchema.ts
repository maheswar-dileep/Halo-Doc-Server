import mongoose, { model, Schema } from 'mongoose'

const doctorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        requied: true
    },
    photoURL: {
        type: String,
        required: true
    },
    AuthEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    AuthPhone: {
        type: String,
        required: true
    }
});

const doctorModel = mongoose.model('doctor', doctorSchema);
export default doctorModel;