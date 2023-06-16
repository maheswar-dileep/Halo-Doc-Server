import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { APPOINTMENT, BLOG, DOCTOR, USER } from '../model/index.js';
import { IBlog } from '../Types/interface.js';

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});

//* Login

interface IDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
  profile: string;
  photoURL: string;
  dob: string;
  department: string;
  workTime: string;
  fees: string;
  leave: Array<string>;
  password: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const doctor: IDoctor = await DOCTOR.findOne({ email });

    if (!doctor) {
      return res.status(200).send({ success: false, message: 'Doctor does not exist' });
    }

    const match = await bcrypt.compare(password, doctor.password);

    if (match) {
      // Credential verified
      // Creating a JWT token
      const token: string = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: '10d',
      });
      doctor.password = null;
      return res.status(200).send({
        success: true,
        message: 'Doctor login successfull',
        doctor,
        token,
      });
    }
    return res.status(200).send({ success: false, message: 'Wrong Password' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* add-blog

export const addBlog = async (req: Request, res: Response) => {
  try {
    const blogData: IBlog = {
      title: req.body.title,
      content: req.body.content,
      imageURL: req.body.imageURL,
    };

    const blog = new BLOG(blogData);
    await blog.save();

    return res.status(200).send({ success: true, message: 'Blog adding successfull' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* get-appointment

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await APPOINTMENT.find({ doctorId: id });

    return res.status(200).send({ success: true, message: 'Get Appointments Successful', data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* cancel-appointment

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await APPOINTMENT.findOne({ _id: id });
    if (!appointment) return res.status(404).send({ success: false, message: 'Appointment not found' });

    await stripe.refunds.create({
      payment_intent: appointment.payment_intent,
    });

    await APPOINTMENT.updateOne({ _id: id }, { cancelled: true, active: false });

    return res.status(200).send({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* get Doctor

export const getDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await DOCTOR.find({ _id: id });
    return res.status(200).send({ success: true, message: 'get doctor Successful', doctor });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* edit doctor

export const editDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //* Destructuring Data from request body

    const {
      firstName,
      fees,
      workTime,
      lastName,
      email,
      phone,
      address,
      department,
      dob,
      profile,
      photoURL,
    }: IDoctor = req.body;

    const doctor = {
      firstName,
      lastName,
      email,
      phone,
      address,
      profile,
      department,
      dob,
      fees,
      workTime,
      photoURL,
    };

    //  Updating Doctor Profile
    const result = await DOCTOR.updateOne({ email }, doctor);
    console.log(result);

    return res.status(200).json({ success: true, message: 'Doctor profile edited succesfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'internal server error' });
  }
};

//* Get-All-Doctors

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await DOCTOR.find({});
    res.status(200).send({ success: true, message: 'get All doctors succesfull', data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* get Patients Stat

export const getPatients = async (req: Request, res: Response) => {
  try {
    const id = req.params?.id;
    const patients = await APPOINTMENT.aggregate([
      {
        $group: {
          _id: '$doctorId',
          male: {
            $sum: {
              $cond: [{ $eq: ['$gender', 'male'] }, 1, 0],
            },
          },
          female: {
            $sum: {
              $cond: [{ $eq: ['$gender', 'female'] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          doctorId: '$_id',
          male: 1,
          female: 1,
          total: 1,
        },
      },
    ]);
    res.status(200).send({ success: true, message: 'get patients successful', patients });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* get total revenue

export const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    const id = req.params?.id;
    const revenue = await APPOINTMENT.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $toInt: '$price' } },
        },
      },
    ]);

    res.status(200).send({ success: true, message: 'get revenue successful', revenue: revenue[0].totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* Apply Leave

export const applyLeave = async (req: Request, res: Response) => {
  try {
    const { leaveDate, doctorId } = req.body;

    const doctor = await DOCTOR.findOne({ _id: doctorId });

    if (!doctor) return res.status(404).send({ success: false, message: 'user not found' });

    if (doctor?.leave?.includes(leaveDate)) {
      return res.status(200).json({ success: false, message: 'Leave Already Applied on the Same Date' });
    }

    await DOCTOR.updateOne({ _id: doctorId }, { $push: { leave: leaveDate } });

    return res.status(200).send({ success: true, message: 'Leave Applied Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Apply Leave

export const cancelLeave = async (req: Request, res: Response) => {
  try {
    const { leaveDate, doctorId } = req.body;

    const doctor = await DOCTOR.findOne({ _id: doctorId });

    if (!doctor) return res.status(404).send({ success: false, message: 'user not found' });

    if (doctor?.leave?.includes(leaveDate) === false) {
      return res.status(200).json({ success: false, message: 'No Leave on the Same Date' });
    }

    const date = doctor.leave.filter((data) => data !== leaveDate);

    await DOCTOR.updateOne({ _id: doctorId }, { leave: date });

    const result = await DOCTOR.findOne({ _id: doctorId });

    return res.status(200).send({ success: true, message: 'Leave Cancelled Successfully', result: result.leave });
  } catch (error) {
    console.log('Error in doctor:: cancel leave :- ', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Add Prescription

export const addPrescription = async (req: Request, res: Response) => {
  try {
    const { id, medicine, dosage, notes, doctor, date } = req.body;

    const user = await USER.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!user) return res.status(404).send({ success: false, message: 'Prescription not found with id' });

    user.prescription.push({
      id: user.prescription.length + 1,
      medicine,
      dosage,
      notes,
      doctor,
      date,
    });

    await user.save();

    return res.status(200).send({ success: true, message: 'Prescription added Successfully' });
  } catch (error) {
    console.error('Error in doctor: add prescription :-', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* get monthly revenue

export const getMontlyRevenue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await APPOINTMENT.aggregate([
      {
        $group: {
          _id: {
            month: { $month: { $toDate: '$date' } },
            year: { $year: { $toDate: '$date' } },
          },
          revenue: { $sum: { $toDouble: '$price' } },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const monthlyRevenueArray = Array(12).fill(0);

    result.forEach((item) => {
      const monthIndex = item._id.month - 1;
      monthlyRevenueArray[monthIndex] = item.revenue;
    });

    res.status(200).send({ success: true, message: 'get Revenue Successfull', data: result });
  } catch (error) {
    console.log('error in get monthly revenue', error);
    res.status(500).json({ error: 'Unable to retrieve the data' });
  }
};
