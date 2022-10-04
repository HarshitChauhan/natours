const express = require('express');

const router = express.Router();
const { signup, login, forgotPassword, resetPassword, protect, updatePassword } = require('../controllers/authController');
const { getAllUsers, createNewUser, getUserById, updateUser, deleteUser, updateMe, deleteMe } = require('../controllers/userController');

// Authentication routes for users
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

// other routes
router.route('/')
    .get(getAllUsers)
    .post(createNewUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;