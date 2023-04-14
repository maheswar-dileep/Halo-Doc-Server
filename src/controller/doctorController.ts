import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { DOCTOR } from '../model/schema/export.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const doctor = await DOCTOR.findOne({ email });

    if (!doctor) {
      return res.status(200).send({ success: false, message: 'Doctor does not exist' });
    }

    const match = await bcrypt.compare(password, doctor.password);

    if (match) {
      res.status(200).send({ success: true, message: 'Doctor login successfull' });
    } else {
      res.status(200).send({ success: true, message: 'Wrong Password' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

export const addBlog = async (params: type) => {};
