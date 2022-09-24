const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// Get all Users
exports.getAllUsers = catchAsync( async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
});

// Create a new User
exports.createNewUser = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Get User by ID
exports.getUserById = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Update User
exports.updateUser = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Delete User
exports.deleteUser = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}