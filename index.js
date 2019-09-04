const express = require("express");

const app = express();
const genres = require("./routes/genres");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/genres", genres);

app.listen(port, () => console.log(`Listening on port ${port}...`));
