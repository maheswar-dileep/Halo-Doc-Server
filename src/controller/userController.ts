import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { USER } from '../model/schema/export.js';
import RequestDefenition from '../defenitions.js';
import { verifyFirebaseToken } from '../config/firebase.js';

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    /**
     * * Getting user detiails from idToken
     */

    const { idToken } = req.body.idToken;
    const user = await verifyFirebaseToken({ idToken });

    const userData = {
      name: user.displayName,
      email: user.email,
      profileURL: user.photoURL ? user.photoURL : false,
    };

    /**
     * * Saving userData to Database
     */

    const newUser = new USER(userData);
    newUser.save().then((response) => {
      const id = response._id;
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

    const { idToken } = req.body.idToken;
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
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal server error' });
  }
};

export const getUserInfo = (req: RequestDefenition, res: Response) => {
  try {
    console.log(req.user);
  } catch (error) {}
};
