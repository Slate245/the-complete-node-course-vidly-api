const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    numberInStock: {
      type: Number,
      required: true
    },
    dailyRentalRate: {
      type: Number,
      required: true
    },
    genre: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50
        }
      }),
      required: true
    }
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .required()
      .min(2)
      .max(50),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
    genre: Joi.object()
      .keys({
        name: Joi.string()
          .required()
          .min(2)
          .max(50)
      })
      .required()
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
