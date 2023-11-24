const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Place = require("./models/place");

const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/mevn_directory")
  .then(() => {
    console.log("Connected to MongoDB");
    startServer(); // Call the function to start the server once connected to MongoDB
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Route to render the home page
app.get("/", async (req, res) => {
  res.render("home");
});

// Function to start the server
function startServer() {
  app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`);
  });
}
