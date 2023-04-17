const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw new Error("Provide valid email")
    }
  },
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profile: {
    type: String
  }

}, {
  timestamps: true
})

const User = mongoose.model("Users", userSchema);

module.exports = User;