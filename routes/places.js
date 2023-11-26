const express = require("express");
const Place = require("../models/place");
const { placeSchema } = require("../schemas/place");
const ErrorHandler = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middlewares/isValidObjectId");

const router = express.Router();

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(error, 400));
  } else {
    next();
  }
};

// Routes

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

router.get("/create", (req, res) => {
  res.render("places/create");
});

router.post(
  "/",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash("success_msg", "Place added successfully");
    res.redirect("/places");
  })
);

router.get(
  "/:id",
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("reviews");
    res.render("places/show", { place });
  })
);

router.get(
  "/:id/edit",
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).send("Tempat tidak ditemukan");
    }
    res.render("places/edit", { place });
  })
);

router.put(
  "/:id",
  isValidObjectId("/places"),
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    req.flash("success_msg", "Place updated successfully");
    if (!place) {
      return res.status(404).send("Tempat tidak ditemukan");
    }
    res.redirect("/places/${req.params.id}");
  })
);

router.delete(
  "/:id",
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places");
  })
);

module.exports = router;
