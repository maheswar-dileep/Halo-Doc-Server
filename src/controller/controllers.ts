import { Request, Response } from 'express';
import { BLOG, DEPARTMENT, DOCTOR } from '../model/export.js';

//* Get-all-blogs

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;

    const options = {
      page: page || 1,
      limit: 8,
    };

    const data = await BLOG.paginate({}, options);

    res.status(200).send({ success: true, message: 'get all blog successfull', data });
  } catch (error) {
    console.log('Error in common controller: Get-All-blogs :-', error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;

    const options = {
      page: page || 1,
      limit: 12,
    };
    const data = await DOCTOR.paginate({}, options);

    return res.status(200).send({ success: true, message: 'get all Doctors Successful', data });
  } catch (error) {
    console.log('Error in common contoller - Get-all-doctors :-', error);
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

export const searchDoctors = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword.toString(), 'i');

    const result = await DOCTOR.find({ firstName: { $regex: regex } });
    return res.status(200).send({ success: true, message: 'search doctor successful', result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: true, message: 'Internal Server Error' });
  }
};
