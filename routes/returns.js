const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.customerId) return res.status(400).send("Invalid customer.");
  res.status(401).send("Unauthorized");
});

module.exports = router;
