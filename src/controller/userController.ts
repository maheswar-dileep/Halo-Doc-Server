import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { USER } from "../model/schema/export.js";
import { Request, Response } from "express";
import firebaseConfig from "../firebase/firebase.config.js";
import admin from "firebase-admin";


export const server = (req: Request, res: Response) => {
  try {
    console.log("hello from server");
    res.status(200).send({ success: true, mesage: "hello from server" });
  } catch (error) {
    res.status(500).send({ success: false, message: "internal server error" });
  }
};

export const signup = (req: Request, res: Response) => {
  try {
    res.status(200).send({ success: true, message: "signup with credentials succesful" });
  } catch (err) {
    res.status(500).send({ success: false, message: "internal server error" });
  }
};

export const googleSignup = (req: Request, res: Response) => {
  try {
    const token = req.body.token;

    const verifyToken = async (token: string) => {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log(decodedToken);
      } catch (error) {
        console.log(error);
      }
    };

    verifyToken(token);

    res.status(200).send({ success: true, message: "google login succesful" });
  } catch (error) {
    res.status(500).send({ success: false, message: "internal server error" });
  }
};
