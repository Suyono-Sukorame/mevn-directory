const ejsMate = require("ejs-mate");
const express = require("express");
const ErrorHandler = require("./utils/ExpressError");
const Joi = require("joi");
const methodOverride = require("method-override");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync");
const mongoose = require("mongoose");
const Place = require("./models/place");

const app = express();

// schemas
const { placeSchema } = require("./schemas/place");

// Set view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(error, 400));
  } else {
    next();
  }
};

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/mevn_directory");
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Server is running on http://127.0.0.1:3000`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Routes
app.get("/", async (req, res) => {
  res.render("home");
});

app.get(
  "/places",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

app.get("/places/create", (req, res) => {
  res.render("places/create");
});

app.post(
  "/places",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect("/places");
  })
);

app.get(
  "/places/:id",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/show", { place });
  })
);

app.get(
  "/places/:id/edit",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).send("Tempat tidak ditemukan");
    }
    res.render("places/edit", { place });
  })
);

app.put(
  "/places/:id",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    if (!place) {
      return res.status(404).send("Tempat tidak ditemukan");
    }
    res.redirect("/places");
  })
);

app.delete(
  "/places/:id",
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect("/places");
  })
);

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

// Start the server after connecting to MongoDB
startServer();
