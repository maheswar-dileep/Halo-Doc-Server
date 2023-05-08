import express from 'express';
import * as controller from '../controller/controllers.js';

const router = express.Router();

//* blogs

router.route('/blogs/get-all-blogs').get(controller.getAllBlogs); //! get-all-blogs
router.route('/get-department').get(controller.getDepartments); //! get-Department

export default router;