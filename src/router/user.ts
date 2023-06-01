import express from 'express';
import * as controller from '../controller/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

//* Signup Login

router.route('/signup').post(controller.signup); //! user signup
router.route('/login').post(controller.login); //! user login

//* get doctors

router.route('/get-user-info/:id').get(auth, controller.getUserInfo);
router.route('/doctors-by-department').get(controller.getDoctorsbyDept); //! doctors by department

//* Payment

router.route('/payment').post(controller.payment); //! Payment
router.route('/webhook').post(controller.webHooks); //! Payment WebHooks

//* Appoinment

router.route('/appointment/cancel-appointment/:id').patch(controller.cancelAppointment); //! Cancel appointment
router.route('/create-notifications').post(controller.createNotification); //! Create Notification
router.route('/check-available-timing').post(controller.checkAvailableTiming); //! Check Available Timing

//* report / feedback

router.route('/report-doctor').post(controller.reportDoctor); //!  Report Doctor
router.route('/feedback').post(controller.createFeedback); //!  feedback

export default router;
