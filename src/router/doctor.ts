import express from 'express';
import * as controller from '../controller/doctorController.js';
// import auth from '../middlewares/auth.js';

const router = express.Router();

//* login
router.route('/login').post(controller.login);

//* appointments

router.route('/appointment/get-appointments/:id').get(controller.getAppointments);
router.route('/appointment/cancel-appointment/:id').patch(controller.cancelAppointment);

//* get routes
router.route('/get-doctor/:id').get(controller.getDoctor);
router.route('/edit-doctor/:id').patch(controller.editDoctor);
router.route('/patients/:id').get(controller.getPatients);
router.route('/get-total-revenue/:id').get(controller.getTotalRevenue);

//* apply for Leave

router.route('/apply-leave').patch(controller.applyLeave);
router.route('/cancel-leave').patch(controller.cancelLeave);

export default router;
