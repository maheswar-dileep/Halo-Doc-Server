import express from 'express'
import * as controller from '../controller/userController.js'

const router = express.Router();

router.route('/server').get(controller.server)

router.route('/signup').post(controller.signup);
router.route('/signup/google').post(controller.googleSignup);

export default router