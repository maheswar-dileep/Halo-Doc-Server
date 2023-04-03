import express from 'express'
import * as controller from '../controller/adminController.js'

const router = express.Router();

router.route('/login').post(controller.login);//admin login
router.route('/doctor/add-doctor').post(controller.addDoctor);//admin login

export default router;