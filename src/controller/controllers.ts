import { Request, Response } from 'express';
import { BLOG, DEPARTMENT, DOCTOR } from '../model/export.js';

//* Get-all-blogs

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BLOG.find({});
    res.status(200).send({ success: true, message: 'get all blog successfull', data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const data = await DOCTOR.find({});

    return res.status(200).send({ success: true, message: 'get all Doctors Successful', data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: true, message: 'Internal Server Error' });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const department = await DEPARTMENT.find({});
    return res.status(200).send({ success: true, message: 'get department successful', data: department });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: true, message: 'Internal Server Error' });
  }
};
