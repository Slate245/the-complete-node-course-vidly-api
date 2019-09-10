const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    phone: { type: String, required: true, minlength: 5, maxlength: 50 }
  })
);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name: Joi.string()
      .required()
      .min(2)
      .max(50),
    phone: Joi.string()
      .required()
      .min(5)
      .max(50)
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
