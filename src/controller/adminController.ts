import { Request, Response } from "express"
import { ADMIN, DOCTOR } from '../model/schema/export.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const login = async (req: Request, res: Response) => {
    try {
        /**
         * * validating email 
         */

        console.log(req.body)

        const user = await ADMIN.findOne({ email: req.body.email })
        if (!user) return res.status(200).send({ success: false, message: 'user does not exist' })

        /**
         * *comparing hashed password with bcrypt
         * */

        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) return res.status(200).send({ success: false, message: "password doesn't match" })
        else {

            /**
         * * Credential verified 
         * * JWT Token creating 
         */

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            })

            res.status(200).send({ success: true, message: 'login succesful', token })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }
}

export const addDoctor = async (req: Request, res: Response) => {
    try {

        /**
         * * Destructuring Req.body data
         */

        let { firstName, lastName, email, phone, address, profile, AuthEmail, password, AuthPhone,photoURL } = req.body

        password = await bcrypt.hash(password, 10)

        let doctor = {
            firstName, lastName, email, phone, address, profile, AuthEmail, password, AuthPhone, photoURL
        }

        /**
         * * Adding New Doctor to Database
         * */
        const newDoctor = new DOCTOR(doctor)
        newDoctor.save().then((response) => {
            console.log(response)
            res.status(200).json({ success: true, message: "Doctor added succesfully" })
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }

}