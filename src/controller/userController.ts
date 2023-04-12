import dotenv from "dotenv";
import { Request, Response } from "express";
import { USER } from "../model/schema/export.js";
import { verifyFirebaseToken } from "../firebase/firebase.js";
import jwt from 'jsonwebtoken'
import RequestDefenition from "../defenitions.js";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    /**
     * * Getting user detiails from idToken
     */

    const idToken = req.body.idToken;
    let user = await verifyFirebaseToken({ idToken });

    let userData = {
      name: user.displayName,
      email: user.email,
      profileURL: user.photoURL ? user.photoURL : false
    };

    /**
     * * Saving userData to Database
     */

    const newUser = new USER(userData);
    newUser.save().then((response) => {
      const _id = response._id
      const token = jwt.sign({ id: _id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      })


      res.status(200).send({
        success: true,
        message: user.photoURL ? "google login succesful" : "email login succesfull",
        token
      });
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    /**
     * * Getting user Details from idToken  
     */

    const idToken = req.body.idToken;
    let user = await verifyFirebaseToken({ idToken })


    if (user) {

      const userData = await USER.findOne({ email: user?.email })

      const _id = userData?._id
      const token = jwt.sign({ id: _id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      })

      res.status(200).send({
        success: true,
        message: user.photoURL ? "google login succesful" : "email login succesfull",
        token
      });

    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "internal server error" });
  }
}

export const home = async (req: Request, res: Response) => {

  try {
    console.log(req)
  } catch (error) {
    console.log(error)
  }

}

export const getUserInfo = (req: RequestDefenition, res: Response) => {

  try {
    console.log(req.user)
  } catch (error) {

  }

}