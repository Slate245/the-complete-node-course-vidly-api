const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const validate = require("../middleware/validate");

const { User } = require("../models/user");
const router = express.Router();

// Register new user
router.post("/", validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  const schema = {
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

module.exports = router;
