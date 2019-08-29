const express = require("express");
const Joi = require("@hapi/joi");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const genres = [
  { _id: 1, name: "Action" },
  { _id: 2, name: "Comedy" },
  { _id: 3, name: "Horror" }
];

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };

  return Joi.validate(genre, schema);
}

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g._id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("Genre with a given ID was not found");
  res.send(genre);
});

// Create new genre

app.post("/api/genres/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    _id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

// Update existing genre

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g._id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("Genre with a given ID was not found");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

// Delete existing genre

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g._id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("Genre with a given ID was not found");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
