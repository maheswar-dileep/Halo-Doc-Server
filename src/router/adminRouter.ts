import express from 'express'
import * as controller from '../controller/adminController.js'
import auth from '../middlewares/auth.js';

const router = express.Router();


//* Login 

router.route('/login').post(controller.login); //? admin login

//* User Management

router.route('/users/get-all-users').get(controller.getAllUsers) //? get-all-users
router.route('/users/block-user/:id').patch(controller.blockUser) //?block-user

//* Doctors Management

router.route('/doctors/add-doctors').post(controller.addDoctor); //? Add -doctor
router.route('/doctors/get-all-doctors').get(controller.getAllDoctors) //? get-all-doctors
router.route('/doctors/add-new-department').post(controller.addDepartment) //? add-department
router.route('/doctors/delete-doctor/:id').delete(controller.deleteDoctor)//? delete-Doctor


router.route('/blogs/add-blog').post(controller.addBlog) //? add-blog
router.route('/blogs/edit-blog/:id').get(controller.editBlog) //? edit-blogs
router.route('/blogs/get-single-blog/:id').get(controller.getSingleBlog) //? get-single-blogs
router.route('/blogs/delete-blog/:id').delete(controller.deleteBlog) //? get-single-blogs

export default router;