import express from 'express';
import * as controller from '../controller/doctorController.js';
// import auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/login').post(controller.login);
router.route('/appointment/get-appointments').get(controller.getAppointments);
router.route('/appointment/cancel-appointment').patch(controller.cancelAppointments);

export default router;
