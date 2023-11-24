const ejsMate = require("ejs-mate");
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Place = require("./models/place");

const app = express();

// Set view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.get("/places", async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

app.get("/places/create", (req, res) => {
  res.render("places/create");
});

app.post("/places", async (req, res) => {
  try {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect("/places");
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat menambahkan tempat baru: " + err.message);
  }
});

app.get("/places/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    res.render("places/show", { place });
  } catch (err) {
    res.status(500).send("Terjadi kesalahan saat memuat data place");
  }
});

app.get("/places/:id/edit", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).send("Tempat tidak ditemukan");
    }
    res.render("places/edit", { place });
  } catch (err) {
    res.status(500).send("Terjadi kesalahan saat memuat halaman edit");
  }
});

app.put("/places/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    if (!place) {
      return res.status(404).send("Tempat tidak ditemukan");
    }
    res.redirect("/places");
  } catch (err) {
    res.status(500).send("Terjadi kesalahan saat memperbarui tempat");
  }
});

app.delete("/places/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    res.redirect("/places");
  } catch (err) {
    res.status(500).send("Terjadi kesalahan saat menghapus tempat");
  }
});

// Function to start the server
function startServer() {
  app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`);
  });
}
