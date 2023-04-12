import express from 'express'
import * as controller from '../controller/doctorController.js'
import auth from '../middlewares/auth.js'

const router = express.Router()


router.route('/login').post(controller.login);

export default router;