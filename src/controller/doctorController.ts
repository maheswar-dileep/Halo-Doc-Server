import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { APPOINTMENT, BLOG, DOCTOR } from '../model/export.js';

//* Login *//

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const doctor = await DOCTOR.findOne({ email });

    if (!doctor) {
      return res.status(200).send({ success: false, message: 'Doctor does not exist' });
    }

    const match = await bcrypt.compare(password, doctor.password);

    if (match) {
      // Credential verified
      // Creating a JWT token
      const token: string = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      doctor.password = null;
      return res.status(200).send({ success: true, message: 'Doctor login successfull', doctor, token });
    }
    return res.status(200).send({ success: false, message: 'Wrong Password' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* add-blog *//

export const addBlog = async (req: Request, res: Response) => {
  try {
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

//* get-appointments *//

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const data = await APPOINTMENT.find({ doctorId: id });
    return res.status(200).send({ success: true, message: 'Get Appointments Successful', data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

//* cancel-appointments *//

export const cancelAppointments = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await APPOINTMENT.findByIdAndUpdate(id, { cancelled: true });
    if (result) return res.status(200).send({ success: true, message: 'Appointment cancelled successfully' });
    return res.status(200).send({ success: false, message: 'Appointment not found' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
};
