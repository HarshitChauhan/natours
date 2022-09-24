const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const AppErrorHandler = require('../utils/appErrorHandler');
const catchAsync = require("../utils/catchAsync");

const signJwtToken = ( id ) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        photo: req.body.photo
    });

    const token = signJwtToken(newUser._id);
    
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync( async(req, res, next) => {
    const { email, password } = req.body;
    
    // 1) Check if email and password exists in the body
    if(!email || !password){ 
        return next(new AppErrorHandler('Please provide {email} and {password}!', 400));
    }
    
    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password'); // select() used to populate password field in user variable
    
    if(!user || !(await user.checkPassword(password, user.password))){
        return next(new AppErrorHandler('Incorrect {email} or {password}!', 401));
    }
    
    // 3) Send the token to client if everything is fine
    
    const token = signJwtToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})