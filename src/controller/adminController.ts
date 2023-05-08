import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import {
  ADMIN, DOCTOR, DEPARTMENT, BLOG, USER,
} from '../model/export.js';

dotenv.config();

//* Initialize Cloudinary API

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
 *Admin Controllers
 */

//! ADMIN-LOGIN

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

//! Add-Doctor

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

//! Get-All-Doctors

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await DOCTOR.find({});
    res.status(200).send({ success: true, message: 'get All doctors succesfull', data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//! Delete-doctors

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await DOCTOR.findOne({ _id: id });

    // const publicId = doctor.photoURL.split('profile/')

    // //* Function to delete image

    // const deleteImage = (publicId) => {
    //     cloudinary.uploader.destroy(publicId, (err, result) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             DOCTOR.deleteOne({ _id: id })
    //             console.log(result)
    //         }
    //     })
    // }

    // deleteImage(publicId);

    const result = await DOCTOR.deleteOne({ _id: id });

    if (result.acknowledged) {
      res.status(200).send({ success: true, message: `DR. ${doctor.firstName} deleted succesfully` });
    }
  } catch (error) {
    // console.log(error)
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

//! Add-Department

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

//! Add-Blog

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

//! Get Single Blog

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

//! edit blog
// interface ReqParams {
//   id: string;
// }

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

//! Delete Blog

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //* Function to delete image
    // Todo: delete image from cloudinary

    // const blog = await BLOG.findOne({ _id: id })
    // const publicId: string = blog.imageURL.split('/blog/')[1].split('.')[0]

    // const deleteImage = async (publicId: string) => {
    //     try {
    //         const result = await cloudinary.uploader.destroy(publicId)
    //         if (result) {
    //             console.log(result)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // Example usage
    // deleteImage(publicId);

    const result = await BLOG.deleteOne({ _id: id });
    if (result.acknowledged) {
      res.status(200).send({ success: true, message: 'delete blog Successful' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server Error' });
  }
};

//! Get-All-Users

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await USER.find({});
    res.status(200).send({ success: true, message: 'get all users succesfull', data: users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//! Block-User

export const blockUser = async (req: Request, res: Response) => {
  try {
    let block: boolean;
    const { id } = req.params;
    const user: any = await USER.find({ _id: id });
    if (user.blocked) block = false;
    else block = true;

    const blocked = await USER.updateOne({ _id: id }, { $set: { blocked: block } });

    if (blocked.acknowledged) {
      res.status(200).send({ success: true, message: `${user.blocked ? 'unblocked' : 'blocked'} user` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};
