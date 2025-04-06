import env from environment;
const express = require("express");
const bodyParser = require("body-parser");

const userRoutes = require("./routes"); // Path to your routes file

const cors = require('cors')
const app = express();
const server = http.createServer(app); // Create an HTTP server
app.use(cors())
app.use(bodyParser.json()); // Middleware to parse JSON requests

app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
// Initialize Socket.IO
initializeSocket(server);
const URL = 'http://127.0.0.1:3000/';
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});