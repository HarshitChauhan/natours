const express = require('express');

const router = express.Router();
const { signup, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo } = require('../controllers/authController');
const { getAllUsers, createNewUser, getUserById, updateUser, deleteUser, updateMe, deleteMe, getMe } = require('../controllers/userController');

// Authentication routes for users
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// to Protect all the below routes, using one router middleware trick instead of passing to each route
router.use(protect); 

router.get('/myProfile', getMe, getUserById);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// same technique to restrict access to admins only for below routes
router.use(restrictTo('admin'));

// other routes
router.route('/')
    .get(getAllUsers)
    .post(createNewUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;