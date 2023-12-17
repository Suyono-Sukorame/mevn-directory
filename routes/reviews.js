// routes/reviews.js
const express = require("express");
const ReviewController = require("../controllers/reviews");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorReview } = require("../middlewares/isAuthor");
const { validateReview } = require("../middlewares/validator");

const router = express.Router({ mergeParams: true });

// Route to create a new review for a specific place
router.post("/", isAuth, isValidObjectId("/places"), validateReview, wrapAsync(ReviewController.store));

// Route to delete a specific review from a place
router.delete("/:review_id", isAuth, isAuthorReview, isValidObjectId("/places"), wrapAsync(ReviewController.destroy));

module.exports = router;
