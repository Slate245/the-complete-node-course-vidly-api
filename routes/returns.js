const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerId not provided");
  if (!req.body.movieId) return res.status(400).send("movieId not provided");

  let rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  });
  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.dateReturned = new Date();

  let daysOut = Math.floor(
    (rental.dateReturned - rental.dateOut) / 1000 / 3600 / 24
  );
  daysOut === 0 ? (daysOut = 1) : (daysOut = daysOut);

  rental.rentalFee = daysOut * rental.movie.dailyRentalRate;

  await rental.save();
  return res.status(200).send("OK");
});

module.exports = router;
