const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function() {
  const db = config.get("db");
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useFindAndModify: false,
      reconnectTries: 1
    })
    .then(() => winston.info(`Connected to ${db}...`));
};
