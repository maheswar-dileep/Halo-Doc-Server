import express from 'express';
import * as controller from '../controller/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/signup').post(controller.signup); //! user signup
router.route('/login').post(controller.login); //! user login
router.route('/get-user-info').post(auth, controller.getUserInfo);

export default router;
