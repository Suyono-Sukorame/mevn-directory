const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Contoh definisi variabel currentUser
const currentUser = {
  // Definisikan properti-properti currentUser di sini
};

app.get("/", async (req, res) => {
  // Meneruskan variabel currentUser ke dalam template "home" saat merender
  res.render("home", { currentUser: currentUser });
});

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});
