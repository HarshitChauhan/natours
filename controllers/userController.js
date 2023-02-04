const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppErrorHandler = require('../utils/appErrorHandler')
const factory = require('./handlerFactory');

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

// filter function to filter values what fields can be updated
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
  
    return newObj;
  };

  // Current user updates its profile
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppErrorHandler('This route is not for password updates. Please use /updateMyPassword.', 400)
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    // sending responce to user
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });

  // deleting my profile (not exactly deleting instead deactivating profile so that in future, can be activated again)
  exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
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
// update password will not work from this route  
exports.updateUser = factory.updateOne(User);

// Delete User
exports.deleteUser = factory.deleteOne(User);
