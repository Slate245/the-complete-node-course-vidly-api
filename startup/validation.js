module.exports = function() {
  const Joi = require("@hapi/joi");
  Joi.objectId = require("joi-objectid")(Joi);
};
