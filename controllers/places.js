// controllers/places.js
const Place = require("../models/place");
const { placeSchema } = require("../schemas/place");
const fs = require("fs");
const { geometry } = require("../utils/hereMaps");
const sharp = require("sharp");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const places = await Place.find();
  const clusteringPlace = places.map((place) => {
    return {
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0],
    };
  });
  const clusteredPlace = JSON.stringify(clusteringPlace);
  res.render("places/index", { places, clusteredPlace });
};

module.exports.store = async (req, res, next) => {
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  const geoData = await geometry(req.body.place.location);

  const place = new Place(req.body.place);
  place.author = req.user._id;
  place.images = images;
  place.geometry = geoData;

  // Pengolahan gambar menggunakan Sharp sebelum menyimpannya
  if (req.files && req.files.length > 0) {
    const newImages = [];

    // Mengumpulkan URL gambar yang sudah ada di place.images
    const existingImages = place.images.map((img) => img.url);

    for (const file of req.files) {
      // Menggunakan Sharp untuk resize gambar menjadi 1280x720
      const resizedImage = await sharp(file.path).resize({ width: 1280, height: 720 }).toBuffer();

      // Menyimpan gambar yang sudah di-resize ke server
      const imagePath = `public/images/${file.filename}`;
      await sharp(resizedImage).toFile(imagePath);

      const image = {
        url: imagePath,
        filename: file.filename,
      };

      // Menambahkan hanya gambar yang baru jika belum ada
      if (!existingImages.includes(image.url)) {
        newImages.push(image);
      }
    }

    // Menggabungkan gambar yang sudah ada dengan gambar baru
    place.images.push(...newImages);
  }

  await place.save();

  req.flash("success_msg", "Place added successfully");
  res.redirect("/places");
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
    // Mencari tempat berdasarkan ID
    const placeToUpdate = await Place.findById(req.params.id);

    // Validasi data tempat menggunakan skema validasi (placeSchema)
    const { error } = placeSchema.validate({ place: req.body.place }, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join("; ");
      req.flash("error_msg", errorMessage);
      return res.redirect(`/places/${req.params.id}/edit`);
    }

    // Pengolahan gambar menggunakan sharp sebelum menyimpannya
    if (req.files && req.files.length > 0) {
      const newImages = [];

      // Mengumpulkan URL gambar yang sudah ada
      const existingImages = placeToUpdate.images.map((img) => img.url);

      for (const file of req.files) {
        // Menggunakan sharp untuk resize gambar menjadi 1280x720
        const resizedImage = await sharp(file.path).resize({ width: 1280, height: 720 }).toBuffer();

        // Menyimpan gambar yang sudah di-resize ke server
        const imagePath = `public/images/${file.filename}`;
        await sharp(resizedImage).toFile(imagePath);

        const image = {
          url: imagePath,
          filename: file.filename,
        };

        // Menambahkan hanya gambar yang baru jika belum ada
        if (!existingImages.includes(image.url)) {
          newImages.push(image);
        }
      }

      // Menggabungkan gambar yang sudah ada dengan gambar baru
      placeToUpdate.images.push(...newImages);
    }

    // Update data tempat dengan gambar yang baru (jika ada)
    if (req.files && req.files.length > 0) {
      await placeToUpdate.save();
    }

    const geoData = await geometry(placeToUpdate.location);

    // Menyimpan data tempat yang sudah di-update ke database
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, { ...req.body.place, geometry: geoData });

    req.flash("success_msg", "Place updated successfully");
    res.redirect(`/places/${req.params.id}`);
  } catch (err) {
    console.error("Error updating place:", err);
    req.flash("error_msg", "Failed to update place");
    res.redirect(`/places/${req.params.id}/edit`);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) {
      req.flash("error_msg", "Place not found");
      return res.redirect("/places");
    }
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places");
  } catch (err) {
    console.error("Error deleting place:", err);
    req.flash("error_msg", "Failed to delete place");
    res.redirect(`/places/${req.params.id}`);
  }
};

module.exports.deleteImage = async (req, res) => {
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
