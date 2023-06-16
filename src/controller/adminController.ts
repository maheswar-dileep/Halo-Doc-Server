import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { v2 as cloudinary } from 'cloudinary';
import { ADMIN, APPOINTMENT, BLOG, DEPARTMENT, DOCTOR, FEEDBACK, REPORT_DOCTOR, USER } from '../model/index.js';
import { Ioptions } from '../Types/interface.js';

dotenv.config();

//* Initialize Cloudinary API

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});

/*
 *Admin Controllers
 */

//* ADMIN-LOGIN

export const login = async (req: Request, res: Response) => {
  try {
    //* validating email *

    const user = await ADMIN.findOne({ email: req.body.email });
    if (!user) {
      // If no user returning error response with code 200
      return res.status(200).send({ success: false, message: 'user does not exist', error: 'email' });
    }

    // comparing hashed password with bcrypt
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      // If the password is incorrect returning error with code 200
      return res.status(200).send({ success: false, message: "password doesn't match", error: 'password' });
    }

    // Credential verified
    // Creating a JWT token
    const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Sending succes a succesful login response with token
    return res.status(200).send({ success: true, message: 'login succesful', token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'internal server error' });
  }
};

//* Add-Doctor

interface IUserReqBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  dob: Date;
  fees: string;
  workTime: string;
  photoURL: string;
  password: string;
  profile?: string;
  address: string;
}

export const addDoctor = async (req: Request, res: Response) => {
  try {
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
    }: IUserReqBody = req.body;

    const doctorExists = await DOCTOR.findOne({ email });
    if (doctorExists) {
      // if doctor already exists with same email returning error with response code 200
      return res.status(200).send({ success: false, message: 'Doctor already exists' });
    }

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
      password: await bcrypt.hash(req.body.password, 10),
      photoURL,
    };

    // Adding New Doctor to Database
    const newDoctor = new DOCTOR(doctor);
    newDoctor.save();

    return res.status(200).json({ success: true, message: 'Doctor added succesfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'internal server error' });
  }
};

//* Get-All-Doctors

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const options: Ioptions = {
      page: Number(page) || 1,
      limit: 8,
    };

    const data = await DOCTOR.paginate({}, options);
    res.status(200).send({ success: true, message: 'get All doctors succesfull', data });
  } catch (error) {
    console.error('Error in admin: Get-Doctors :-', error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* Delete-doctors

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await DOCTOR.findOne({ _id: id });
    const result = await DOCTOR.deleteOne({ _id: id });

    if (result.acknowledged) {
      res.status(200).send({ success: true, message: `DR. ${doctor.firstName} deleted succesfully` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

//* Add-Department

export const addDepartment = async (req: Request, res: Response) => {
  try {
    //* Finding if the Department already exists or not
    const { name } = req.body;
    const deptExists = await DEPARTMENT.findOne({ name });
    if (deptExists) {
      //* if department exists returning error with code 200
      return res.status(200).send({ success: false, message: 'Department already exists' });
    }

    //* Adding To Database

    const newDept = new DEPARTMENT({ name });
    const result = await newDept.save();

    if (result) {
      return res.status(200).send({ success: true, message: 'Department adding successful' });
    }
    return res.status(400).send({ success: false, message: 'Department adding failed' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* Add-Blog

export const addBlog = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const blogData = {
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

//* Get Single Blog

export const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params?.id;
    console.log(req.params?.id);

    const blogData = await BLOG.findOne({ _id: id });

    if (!blogData) return res.status(401).send({ success: false, message: 'no blog data found' });

    return res.status(200).send({ success: true, message: 'Get Single Blog Successfull', data: blogData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* edit blog

export const editBlog = async (req: Request, res: Response) => {
  try {
    const { id }: { id?: string } = req.params;

    const data = req.body;
    const result = await BLOG.updateOne({ _id: id }, data);
    if (result.acknowledged) res.status(200).send({ success: true, message: 'Edit Blog Successfull' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* Delete Blog

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BLOG.deleteOne({ _id: id });

    if (result.acknowledged) {
      res.status(200).send({ success: true, message: 'delete blog Successful' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server Error' });
  }
};

//* Get-All-Users

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;

    const options: Ioptions = {
      page: Number(page) || 1,
      limit: 6,
    };

    const data = await USER.paginate({}, options);

    res.status(200).send({ success: true, message: 'get all users succesfull', data });
  } catch (error) {
    console.log('Error in admin - Get All Users :-', error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* Get Doctor reports

export const getDoctorReports = async (req: Request, res: Response) => {
  try {
    const doctorReports = await REPORT_DOCTOR.find({});
    res.status(200).send({ success: true, message: 'get doctor reports successfull', doctorReports });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Get User Feedbacks

export const getUserFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await FEEDBACK.find({});
    res.status(200).send({ success: true, message: 'Get Feedbacks Successfull', feedbacks });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Get Payments List

export const getPaymentsList = async (req: Request, res: Response) => {
  try {
    const PAGE_SIZE = 8;
    const options = {
      limit: PAGE_SIZE,
    };
    let charges;
    const { page } = req.query;

    if (page === 'next' && req.query.lastPaymentId) {
      //* To get the next page of charges

      charges = await stripe.charges.list({
        ...options,
        starting_after: req.query.lastPaymentId as string,
      });
    } else if (page === 'prev' && req.query.firstPaymentId) {
      //* To get the previous page of charges

      charges = await stripe.charges.list({
        ...options,
        ending_before: req.query.firstPaymentId as string,
      });
    } else {
      //* To get the first page of charges

      charges = await stripe.charges.list(options);
    }

    res.status(200).send({ success: true, message: 'Get Payments Successful', payments: charges });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Get Payments refund List

export const getPaymentsRefundList = async (req: Request, res: Response) => {
  try {
    const PAGE_SIZE = 3;
    const options = {
      limit: PAGE_SIZE,
    };
    let refunds;
    const { page } = req.query;

    if (page === 'next' && req.query.lastRefundId) {
      //* To get the next page of refunds

      refunds = await stripe.refunds.list({
        ...options,
        starting_after: req.query.lastRefundId as string,
      });
    } else if (page === 'prev' && req.query.firstRefundId) {
      //* To get the previous page of refunds

      refunds = await stripe.refunds.list({
        ...options,
        ending_before: req.query.firstRefundId as string,
      });
    } else {
      //* To get the first page of refunds

      refunds = await stripe.refunds.list(options);
    }

    res.status(200).send({ success: true, message: 'Get Refunds Successful', refunds });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* get revenue

export const getRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await APPOINTMENT.aggregate([
      { $match: { cancelled: false } },
      { $group: { _id: null, totalPrice: { $sum: { $toInt: '$price' } } } },
    ]);

    // get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // group appointments by date and sum up prices
    const result = await APPOINTMENT.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $group: {
          _id: '$date',
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
    ]);

    res.status(200).send({ success: true, message: 'get revenue successfull', revenue: revenue[0].totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* get number of appointment

export const totalAppoinmtent = async (req: Request, res: Response) => {
  try {
    const maleCount: number = await APPOINTMENT.countDocuments({ gender: 'male' });
    const femaleCount: number = await APPOINTMENT.countDocuments({ gender: 'female' });
    const total: number = maleCount + femaleCount;
    const data = {
      maleCount,
      femaleCount,
      total,
    };

    res.status(200).send({ success: true, message: 'get revenue successfull', data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* get number of doctors

export const getTotalDoctors = async (req: Request, res: Response) => {
  try {
    const doctorsCount: number = await DOCTOR.countDocuments({}, {});

    res.status(200).send({ success: true, message: 'get revenue successfull', doctorsCount });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const result = await APPOINTMENT.aggregate([
      {
        $match: {
          cancelled: false,
        },
      },
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

    return res.status(200).send({ success: true, message: 'get revenue successfull', data: monthlyRevenueArray });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};
