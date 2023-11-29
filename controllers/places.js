const Place = require("../models/place");
const fs = require("fs").promises;
const hereMaps = require("../utils/hereMaps");

module.exports.index = async (req, res) => {
  try {
    const places = await Place.find();
    const clusterPlaces = places
      .map((place) => {
        if (place.geometry && place.geometry.coordinates && place.geometry.coordinates.length >= 2) {
          return {
            lat: place.geometry.coordinates[1],
            lng: place.geometry.coordinates[0],
          };
        }
        return null; // Atau bisa juga di-handle dengan cara lain sesuai kebutuhan
      })
      .filter(Boolean); // Hapus nilai null dari array hasil map
    const cluster = JSON.stringify(clusterPlaces);
    res.render("places/index", { places, cluster });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.create = (req, res) => {
  res.render("places/create");
};

module.exports.store = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => ({ url: file.path, filename: file.filename })) : [];

    const place = new Place(req.body.place);
    place.author = req.user._id;

    // Check if location exists in the request body
    if (req.body.place && req.body.place.location) {
      const geoData = await hereMaps.geometry(req.body.place.location);
      place.geometry = geoData;
    }

    place.images = images;

    await place.save();

    req.flash("success_msg", "Place Created!");
    return res.redirect("/places");
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/places/create");
  }
};

module.exports.show = async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("places/show", { place });
};

module.exports.edit = async (req, res) => {
  const place = await Place.findById(req.params.id);
  res.render("places/edit", { place });
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place });

    if (!place) {
      req.flash("error_msg", "Place not found");
      return res.redirect("/places");
    }

    if (req.files && req.files.length > 0) {
      if (place.images && place.images.length > 0) {
        for (let image of place.images) {
          await fs.unlink(image.url);
        }
      }

      const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
      place.images = images;
      await place.save();
    }

    req.flash("success_msg", "Place Updated!");
    res.redirect(`/places/${place._id}`);
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect(`/places/${req.params.id}/edit`);
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      req.flash("error_msg", "Place not found");
      return res.redirect("/places");
    }

    if (place.images && place.images.length > 0) {
      // Hapus file gambar dari sistem file
      for (const image of place.images) {
        fs.unlinkSync(image.url);
      }
    }

    await Place.findByIdAndDelete(id);
    req.flash("success_msg", "Place Deleted!");
    return res.redirect("/places");
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/places");
  }
};

module.exports.destroyImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    // Cek apakah model Place ditemukan berdasarkan ID-nya
    const place = await Place.findById(id);
    if (!place) {
      req.flash("error_msg", "Place not found");
      return res.redirect(`/places/${id}/edit`);
    }

    if (!images || images.length === 0) {
      req.flash("error_msg", "Please select at least one image");
      return res.redirect(`/places/${id}/edit`);
    }

    // Hapus file gambar dari sistem file
    images.forEach((image) => {
      fs.unlinkSync(image);
    });

    // Hapus data gambar dari model Place
    await Place.findByIdAndUpdate(id, { $pull: { images: { url: { $in: images } } } }, { new: true });

    req.flash("success_msg", "Successfully deleted images");
    return res.redirect(`/places/${id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to delete images");
    return res.redirect(`/places/${id}/edit`);
  }
};
