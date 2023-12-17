// app.js

const ejsMate = require("ejs-mate");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const hereMaps = require("./utils/hereMaps");
const app = express();

const User = require("./models/user");

// Connect to MongoDB

mongoose
  .connect("mongodb://127.0.0.1/mevn_directory", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Set up view engine and directory
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
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Home route
app.get("/", async (req, res) => {
  const location = `Pantai Kuta, Kuta, Badung Regency, Bali`;
  const reqLocation = await hereMaps.geocode(location);
  console.log(reqLocation);
  res.render("home");
});

// Routes handling
const userRoutes = require("./routes/user");
const placesRoutes = require("./routes/places");
const reviewsRoutes = require("./routes/reviews");

app.use("/", userRoutes);
app.use("/places", placesRoutes);
app.use("/places/:place_id/reviews", reviewsRoutes);

// Error handling middleware
app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Oh No, Something Wrong!" } = err;
  res.status(status).render("error", { err: message });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
