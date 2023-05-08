import express from 'express';
import * as controller from '../controller/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/signup').post(controller.signup); //! user signup
router.route('/login').post(controller.login); //! user login
router.route('/get-user-info').post(auth, controller.getUserInfo);
router.route('/doctors-by-department').get(controller.getDoctorsbyDept); //! doctors by department
router.route('/payment').post(controller.payment); //! Payment
router.route('/webhook').post(controller.webHooks); //! Payment
export default router;
