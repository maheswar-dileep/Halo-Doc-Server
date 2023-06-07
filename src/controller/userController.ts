import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { USER, APPOINTMENT, DOCTOR, REPORT_DOCTOR, FEEDBACK } from '../model/export.js';
import verifyFirebaseToken from '../config/firebase.js';
import mailService from '../utils/nodemailer.js';
import { IUser } from '../Types/interface.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});

//* User SignUp

export const signup = async (req: Request, res: Response) => {
  try {
    /**
     * * Getting user detiails from idToken
     */

    const { idToken } = req.body;
    const user = await verifyFirebaseToken({ idToken });

    const userData = {
      name: user.displayName,
      email: user.email,
      profileURL: user.photoURL ? user?.photoURL : false,
    };

    // * Saving userData to Database

    const newUser = new USER(userData);
    const response = await newUser.save();
    const id = response?._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    mailService('welcome', user.email);

    res.status(200).send({
      success: true,
      message: user?.photoURL ? 'google login succesful' : 'email login succesfull',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

//* User Login

export const login = async (req: Request, res: Response) => {
  try {
    /**
     * * Getting user Details from idToken
     */

    const { idToken } = req.body;
    const user = await verifyFirebaseToken({ idToken });

    if (user) {
      const userData = await USER.findOne({ email: user?.email });

      const id = userData?._id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.status(200).send({
        success: true,
        message: user?.photoURL ? 'google login succesful' : 'email login succesfull',
        token,
        user: userData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

//* Get User Info

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await USER.findById(id);

    return res.status(200).send({ success: true, message: 'get user successful', data: user });
  } catch (error) {
    console.log('Error in userController : get user info :-', error);
    return res.status(500).send({ success: false, message: 'internal server error' });
  }
};

//* Get Doctors

export const getDoctorsbyDept = async (req: Request, res: Response) => {
  try {
    const { department } = req.query;
    const doctors = await DOCTOR.find({ department });
    return res.status(200).send({ success: true, message: 'Get doctors by department successful', data: doctors });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'internal server error' });
  }
};

//* WEB-HOOK (! For Stripe Payment )

export const webHooks = async (req: Request, res: Response) => {
  try {
    let data;
    let eventType;
    let event;

    const endpointSecret: string = process.env.STRIPE_END_POINT_SECRET;

    if (endpointSecret) {
      const payloadString = JSON.stringify(req.body, null, 2);

      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret,
      });

      try {
        event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    try {
      if (eventType === 'checkout.session.completed') {
        const customer = await stripe.customers.retrieve(data.customer);
        let appointments = customer?.metadata?.appointments;
        appointments = JSON.parse(appointments);
        console.log('webhooks appointments :', appointments);
        appointments.payment_intent = data?.payment_intent;
        const newAppointment = new APPOINTMENT(appointments);
        console.log(newAppointment.save());
      }
    } catch (error) {
      console.log(error);
    }
    res.send().end();
  } catch (error) {
    console.log(error);
  }
};

//* Creating Stripe Payment

export const payment = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    try {
      const customer = await stripe.customers.create({
        metadata: {
          userId: bodyData.userId,
          appointments: JSON.stringify(bodyData),
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: bodyData?.doctorName,
                metadata: {
                  id: bodyData.doctorId,
                  appointments: JSON.stringify(bodyData),
                },
              },
              unit_amount: bodyData.price * 100,
            },
            quantity: 1,
          },
        ],
        customer: customer.id,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/failure`,
      });

      return res.status(200).send({ success: true, message: 'payment successful', url: session.url });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Cancel Appointment

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await APPOINTMENT.find({ id });
    if (!appointment) return res.status(200).send({ success: false, message: 'Appointment not found' });

    const refund = await stripe.refunds.create({
      payment_intent: appointment?.payment_intent,
      amount: appointment?.price,
    });

    return res.status(200).send({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Check Available Timing

export const checkAvailableTiming = async (req: Request, res: Response) => {
  try {
    const { date, doctorId } = req.body;
    const response = await APPOINTMENT.find({ date, doctorId }).select('time').exec();
    return res.status(200).send({ success: true, message: 'Check Availability Successful', data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* Report Doctor

export const reportDoctor = async (req: Request, res: Response) => {
  try {
    const { userId, doctorId, reason } = req.body;

    const newReport = await new REPORT_DOCTOR({ userId, doctorId, reason });
    await newReport.save();

    return res.status(200).send({ success: true, message: 'doctor reported Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

//* feedback

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { doctorId, userId, rating, feedback } = req.body;

    const newFeedback = await new FEEDBACK({
      doctorId,
      userId,
      rating,
      feedback,
    });
    await newFeedback.save();

    return res.status(200).send({ success: true, message: 'Feedback added successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(406).send({ success: false, message: 'Invalid token' });

    const user: IUser | null = await USER.findById(id);
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });

    const { name, email } = req.body;

    const data = {
      name: name || user.name,
      email: email || user.email,
    };

    await USER.findByIdAndUpdate(id, data);

    return res.status(200).send({ success: true, message: 'Update profile successful' });
  } catch (error) {
    console.error('Error in user controller: Update Profile :-', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};
