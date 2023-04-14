import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import RequestDefenition from '../defenitions.js';

dotenv.config();

const auth = async (req: RequestDefenition, res: Response, next: NextFunction) => {
  try {
    const token = await req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(401).send({ success: false, message: 'Invalid Token' });
      } else {
        req.user = { id: data.id };
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ success: false, message: 'Invalid Token' });
  }
};

export default auth;
