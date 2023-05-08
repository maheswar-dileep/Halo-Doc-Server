import { Request, Response, NextFunction } from 'express';
import { USER } from '../model/export.js';

const userBlocked = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.body.id;

    const user = USER.find({ _id: id });

    if (user.blocked == true) {
    }
  } catch (error) {}
};
