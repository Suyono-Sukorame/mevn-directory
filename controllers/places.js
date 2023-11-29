const Place = require("../models/place");
const fs = require("fs");
const hereMaps = require("../utils/hereMaps");

// Menampilkan semua tempat
module.exports.index = async (req, res) => {
  try {
    const places = await Place.find();
    const clusterPlaces = places
      .map((place) => {
        if (place.geometry && place.geometry.coordinates) {
          return {
            lat: place.geometry.coordinates[1],
            lng: place.geometry.coordinates[0],
          };
        } else {
          return null;
        }
      })
      .filter((place) => place !== null);

    const cluster = JSON.stringify(clusterPlaces);
    res.render("places/index", { places, cluster });
  } catch (error) {
    console.error(error);
    res.render("error");
  }
};

// Menampilkan form pembuatan tempat baru
module.exports.create = (req, res) => {
  res.render("places/create");
};

// Menyimpan tempat baru
module.exports.store = async (req, res, next) => {
  try {
    const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    const geoData = await hereMaps.geometry(req.body.place.location);

    const place = new Place(req.body.place);
    place.author = req.user._id;
    place.images = images;
    place.geometry = geoData;

    await place.save();

    req.flash("success_msg", "Place Created!");
    res.redirect("/places");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to create place");
    res.redirect("/places");
  }
};

// Menampilkan detail sebuah tempat
module.exports.show = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    res.render("places/show", { place });
  } catch (error) {
    console.error(error);
    res.render("error");
  }
};

// Menampilkan form edit tempat
module.exports.edit = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  } catch (error) {
    console.error(error);
    res.render("error");
  }
};

// Mengupdate tempat
module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place });

    if (req.files && req.files.length > 0) {
      place.images.forEach((image) => {
        fs.unlinkSync(image.url);
      });

      const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
      place.images = images;
      await place.save();
    }

    req.flash("success_msg", "Place Updated!");
    res.redirect(`/places/${place._id}`);
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to update place");
    res.redirect("/places");
  }
};

// Menghapus tempat
module.exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (place.images.length > 0) {
      place.images.forEach((image) => {
        fs.unlinkSync(image.url);
      });
    }

    await Place.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Place Deleted!");
    res.redirect("/places");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to delete place");
    res.redirect("/places");
  }
};

// Menghapus gambar-gambar pada tempat
module.exports.destroyImages = async (req, res) => {
  try {
    // kode penghapusan gambar-gambar pada tempat
    // ...
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to delete images");
    res.redirect(`/places/${id}/edit`);
  }
};
