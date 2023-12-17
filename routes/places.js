// routes/places.js

const express = require("express");
const PlaceController = require("../controllers/places");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace, isAuthorReview } = require("../middlewares/isAuthor");
const { validatePlace } = require("../middlewares/validator");
const upload = require("../configs/multer");

const router = express.Router();

// Middleware to validate place data
router.route("/").get(wrapAsync(PlaceController.index)).post(isAuth, upload.array("image", 5), validatePlace, wrapAsync(PlaceController.store));

router.get("/create", (req, res) => {
  res.render("places/create");
});

router
  .route("/:id")
  .get(isValidObjectId("/places"), wrapAsync(PlaceController.show))
  .put(isAuth, isAuthorPlace, isValidObjectId("/places"), upload.array("image", 5), validatePlace, wrapAsync(PlaceController.update))
  .delete(isAuth, isAuthorPlace, isValidObjectId("/places"), wrapAsync(PlaceController.delete));

router.get("/:id/edit", isAuth, isAuthorPlace, isValidObjectId("/places"), wrapAsync(PlaceController.edit));

router.delete("/:id/images", isAuth, isAuthorPlace, isValidObjectId("/places"), wrapAsync(PlaceController.deleteImage));

module.exports = router;
