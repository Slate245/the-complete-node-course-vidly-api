require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const app = express();

require("./startup/routes")(app);

process.on("uncaughtException", ex => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", ex => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "error"
  })
);

// throw new Error("Something failed during startup.");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useFindAndModify: false,
    reconnectTries: 1
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
