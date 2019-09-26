const { Rental } = require("../models/rental");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Unauthorized");
  if (!req.body.customerId)
    return res.status(400).send("customerId not provided");
  if (!req.body.movieId) return res.status(400).send("movieId not provided");

  const rental = await Rental.findOne({
    customerId: req.body.customerId,
    movieId: req.body.movieId
  });
  if (!rental)
    return res.status(404).send("No rental found for given customer or movie.");
  res.status(200);
});

module.exports = router;
