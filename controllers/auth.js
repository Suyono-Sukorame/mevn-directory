const User = require("../models/user");

// Menampilkan formulir pendaftaran
module.exports.showRegisterForm = (req, res) => {
  res.render("auth/register");
};

// Menangani proses pendaftaran pengguna baru
module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success_msg", "You are now registered and logged in");
      res.redirect("/places");
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect("/register");
  }
};

// Menampilkan halaman login
module.exports.showLoginForm = (req, res) => {
  res.render("auth/login");
};

// Mengelola proses login
module.exports.loginUser = (req, res) => {
  req.flash("success_msg", "You are now logged in");
  res.redirect("/places");
};

// Mengelola proses logout
module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are now logged out");
    res.redirect("/places");
  });
};
