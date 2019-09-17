const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    }
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
