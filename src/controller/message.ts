import { Request, Response } from 'express';
import { MESSAGE } from '../model/export.js';

export const newMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, sender, text } = req.body;
    const newMsg = new MESSAGE({ conversationId, sender, text });
    const messages = await newMsg.save();
    return res.status(200).send({ success: true, message: 'New Message Successful', messages });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages: object = await MESSAGE.find({ conversationId: id });
    return res.status(200).send({ success: true, message: 'Get Message Successful', messages });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};
