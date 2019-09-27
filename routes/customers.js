const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const express = require("express");

const { Customer, validate: validateCustomer } = require("../models/customer");
const router = express.Router();

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
router.post("/", [auth, validate(validateCustomer)], async (req, res) => {
  const { isGold, name, phone } = req.body;
  const customer = new Customer({ isGold, name, phone });
  await customer.save();
  res.send(customer);
});

// Update existing customer
router.put("/:id", [auth, validate(validateCustomer)], async (req, res) => {
  const { isGold, name, phone } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isGold, name, phone },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with a given ID was not found");

  res.send(customer);
});

// Delete existing customer
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with a given ID was not found");

  res.send(customer);
});

module.exports = router;
