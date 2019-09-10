const Joi = require("@hapi/joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

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
    phone: { type: String, required: true, minlength: 5 }
  })
);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name: Joi.string()
      .required()
      .min(2)
      .max(50),
    phone: Joi.string().required()
  };

  return Joi.validate(customer, schema);
}

// Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

// Get single customer
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with a given ID was not found");

  res.send(customer);
});

// Create new customer
router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;
  let customer = new Customer({ isGold, name, phone });
  customer = await customer.save();
  res.send(customer);
});

// Update existing customer
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold,
      name,
      phone
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with a given ID was not found");

  res.send(customer);
});

// Delete existing customer
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with a given ID was not found");

  res.send(customer);
});

module.exports = router;
