const ejsMate = require("ejs-mate");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");

// const Review = require("./models/review");

const app = express();

// Set view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "this-is-a-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

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

// Validation Middleware

app.get("/", async (req, res) => {
  res.render("home");
});

app.use("/places", require("./routes/places"));
app.use("/places/:place_id/reviews", require("./routes/reviews"));

// Error handling middleware
app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

// Start the server after connecting to MongoDB
startServer();
