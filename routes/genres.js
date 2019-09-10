const Joi = require("@hapi/joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  }
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };

  return Joi.validate(genre, schema);
}

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find({});
    res.send(genres);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("Genre with a given ID was not found");
    res.send(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

// Create new genre

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name
  });

  try {
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

// Update existing genre

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("Genre with a given ID was not found");

    genre.name = req.body.name;
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

// Delete existing genre

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("Genre with a given ID was not found");

    const result = await genre.remove();

    res.send(result);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

module.exports = router;
