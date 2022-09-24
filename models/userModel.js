const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please tell us your name']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provied a valid email']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    password: {
      type: String,
      required: [true, 'Please provied a password'],
      minlength: 8,
      select: false // to not show this field in any kind of output
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE, Not on update
        validator: function(pass) {
          return pass === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
  });

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next(); // if password field is not modified then no need to do anything 
    
    // creating hash for the passwrd value with cost of salt value 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // bcoz we dont need this field to be persisted into database
    next();
})

// it is a instance Method (available to all the user documents) // method is for comparing passwords for login
userSchema.methods.checkPassword = async(candidatePassword, userPassword) => await bcrypt.compare(candidatePassword, userPassword);

const User = mongoose.model('User', userSchema);

module.exports = User;