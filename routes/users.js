const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User, validate } = require("../models/user");
const router = express.Router();

// Register new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
