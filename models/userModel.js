const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    passwordChangedAt: {
      type: Date,
      default: new Date().toISOString()
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  });

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next(); // if password field is not modified then no need to do anything 
    
    // creating hash for the passwrd value with cost of salt value 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // bcoz we dont need this field to be persisted into database
    next();
})

// just after password Reset we make the time prior to the time of token generation  
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // 1 sec prior 
  next();
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp; // checking if user has changed the password after the jwt token was issued
  }
  // False means password NOT changed
  return false;
};

// it is a instance Method (available to all the user documents) // method is for comparing passwords for login
userSchema.methods.checkPassword = async(candidatePassword, userPassword) => await bcrypt.compare(candidatePassword, userPassword);

// Password reset functionality
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // valid for 10mins

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;