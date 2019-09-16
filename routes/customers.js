const express = require("express");

const { Customer, validate } = require("../models/customer");
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
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;
  const customer = new Customer({ isGold, name, phone });
  await customer.save();
  res.send(customer);
});

// Update existing customer
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with a given ID was not found");

  res.send(customer);
});

module.exports = router;
