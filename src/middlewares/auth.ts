import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import RequestDefenition from '../defenitions.js';

dotenv.config();

const auth = async (req: RequestDefenition, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).send({ success: false, message: 'Missing Token' });

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err: VerifyErrors | null, decoded: string | JwtPayload) => {
        if (err) return res.status(401).send({ success: false, message: 'Invalid Token' });
        req.user = { id: decoded?.id };

        next();
      },
    );
  } catch (error) {
    console.log('Error in auth midleware :-', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export default auth;
