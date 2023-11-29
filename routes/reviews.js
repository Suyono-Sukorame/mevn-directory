const express = require("express");
const ReviewController = require("../controllers/reviews");
const { reviewSchema } = require("../schemas/review");
const ErrorHandler = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth.js");
const { isAuthorReview } = require("../middlewares/isAuthor.js");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(error, 400));
  } else {
    next();
  }
};

router.post("/", isAuth, isValidObjectId("/places"), validateReview, wrapAsync(ReviewController.store));
router.delete("/:review_id", isAuth, isAuthorReview, isValidObjectId("/places"), wrapAsync(ReviewController.destroy));

module.exports = router;
