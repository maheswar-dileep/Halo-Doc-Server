import { Request, Response } from 'express';
import { CONVERSATION } from '../model/index.js';

//* conversation controller

export const newConversation = async (req: Request, res: Response) => {
  try {
    const { senderId, recieverId } = req.body;

    const newConvs = await new CONVERSATION({ members: [recieverId, senderId] });
    const data = await newConvs.save();

    return res.status(200).send({ success: true, message: 'Conversation Created Successfully', convId: data._id });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: true, message: 'Internal Server Error' });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const conversation = await CONVERSATION.find({
      members: { $in: [id] },
    });
    return res.status(200).send({ success: true, message: 'get conversation successfull', conversation });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};
