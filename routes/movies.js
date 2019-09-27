const auth = require("../middleware/auth");
const express = require("express");

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find({});
  res.send(movies);
});

// Get single movie
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("Movie with a given ID was not found");

  res.send(movie);
});

// Create new movie
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const { title, numberInStock, dailyRentalRate } = req.body;
  const movie = new Movie({
    title,
    numberInStock,
    dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });
  await movie.save();
  res.send(movie);
});

// Update existing movie
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const { title, numberInStock, dailyRentalRate } = req.body;
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      numberInStock,
      dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name
      }
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("Movie with a given ID was not found");

  res.send(movie);
});

// Delete existing movie
router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("Movie with a given ID was not found");

  res.send(movie);
});

module.exports = router;
