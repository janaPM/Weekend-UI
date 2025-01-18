const express = require("express");

const bodyParser = require("body-parser");

const userRoutes = require("./routes"); // Path to your routes file

const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.json()); // Middleware to parse JSON requests

app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});