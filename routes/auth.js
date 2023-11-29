const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// Rute-rute untuk otentikasi
router.get("/register", AuthController.showRegisterForm);
router.post("/register", wrapAsync(AuthController.registerUser));
router.get("/login", AuthController.showLoginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  AuthController.loginUser
);
router.post("/logout", AuthController.logoutUser);

module.exports = router;
