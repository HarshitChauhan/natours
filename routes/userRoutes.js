const express = require('express');

const router = express.Router();
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { getAllUsers, createNewUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.route('/')
    .get(getAllUsers)
    .post(createNewUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

// Authentication routes for users
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;