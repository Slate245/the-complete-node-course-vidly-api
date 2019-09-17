const express = require("express");

const { User, validate } = require("../models/user");
const router = express.Router();

// Register new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  await user.save();
  res.send(user);
});

module.exports = router;
