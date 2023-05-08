import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import jwt, { verify } from 'jsonwebtoken';
import { USER, APPOINTMENT, DOCTOR } from '../model/export.js';
import RequestDefenition from '../defenitions.js';
import verifyFirebaseToken from '../config/firebase.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});

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
      profileURL: user.photoURL ? user.photoURL : false,
    };

    // * Saving userData to Database

    const newUser = new USER(userData);
    newUser.save().then((response) => {
      const id = response?._id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.status(200).send({
        success: true,
        message: user.photoURL ? 'google login succesful' : 'email login succesfull',
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

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
        message: user.photoURL ? 'google login succesful' : 'email login succesfull',
        token,
        user: userData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

export const getUserInfo = (req: RequestDefenition, res: Response) => {
  try {
    return res.status(200).send({ success: true, message: 'get user successful' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'internal server error' });
  }
};

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

//! WEB-HOOK

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
        const appointments = customer?.metadata?.appointments;
        const newAppointment = new APPOINTMENT(JSON.parse(appointments));
        newAppointment.save();
      }
    } catch (error) {
      console.log(error);
    }
    res.send().end();
  } catch (error) {
    console.log(error);
  }
};

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
