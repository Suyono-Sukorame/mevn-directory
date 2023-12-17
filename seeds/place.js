// seeds/place.js
const mongoose = require("mongoose");
const Place = require("../models/place"); // Pastikan model Place telah didefinisikan dengan benar
const hereMaps = require("../utils/hereMaps");
const placeSchema = require("../schemas/place");

mongoose
  .connect("mongodb://127.0.0.1/mevn_directory")
  .then(() => {
    console.log("Connected to MongoDB");
    seedPlaces(); // Panggil fungsi seedPlaces setelah koneksi berhasil
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

async function seedPlaces() {
  const places = [
    {
      title: "Taman Mini Indonesia Indah",
      price: 20000,
      description: "Taman hiburan keluarga dengan berbagai replika bangunan dari seluruh Indonesia",
      location: "Taman Mini Indonesia Indah, Jakarta",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pantai Kuta",
      price: 0,
      description: "Pantai yang terkenal di Bali dengan pemandangan sunset yang indah",
      location: "Pantai Kuta, Kuta, Badung Regency, Bali",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Borobudur",
      price: 0,
      description: "Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah",
      location: "Borobudur, Magelang, Central Java",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Kawah Putih",
      price: 0,
      description: "Kawah vulkanik dengan danau berwarna putih di Bandung, Jawa Barat",
      location: "Kawah Putih, Ciwidey, West Java",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Malioboro",
      price: 0,
      description: "Jalan utama di Yogyakarta dengan berbagai toko dan kuliner khas",
      location: "Jl. Malioboro, Yogyakarta City, Special Region of Yogyakarta",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pantai Tanjung Aan",
      price: 10000,
      description: "Pantai dengan pasir berwarna putih dan air laut yang jernih di Lombok, Nusa Tenggara Barat",
      location: "Pantai Tanjung Aan, Lombok, West Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Danau Toba",
      price: 0,
      description: "Danau vulkanik terbesar di Indonesia yang terletak di Sumatera Utara",
      location: "Danau Toba, North Sumatra",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Kawah Ijen",
      price: 100000,
      description: "Kawah vulkanik dengan fenomena blue fire di Banyuwangi, Jawa Timur",
      location: "Kawah Ijen, Banyuwangi, East Java",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pantai Sanur",
      price: 0,
      description: "Pantai di Bali yang cocok untuk berenang dan melihat matahari terbit",
      location: "Pantai Sanur, Denpasar, Bali",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },

    {
      title: "Candi Borobudur",
      price: 25000,
      description: "Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah",
      location: "Candi Borobudur, Borobudur, Magelang, Central Java",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pulau Komodo",
      price: 5000000,
      description: "Pulau di Indonesia yang terkenal dengan komodo, hewan terbesar di dunia",
      location: "Pulau Komodo, East Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Taman Nasional Gunung Rinjani",
      price: 150000,
      description: "Taman nasional yang terletak di Lombok dan memiliki gunung tertinggi kedua di Indonesia",
      location: "Taman Nasional Gunung Rinjani, Lombok, West Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Bukit Tinggi",
      price: 0,
      description: "Kota kecil yang terletak di Sumatera Barat dengan arsitektur khas Eropa",
      location: "Bukit Tinggi, West Sumatra",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pulau Weh",
      price: 0,
      description: "Pulau yang terletak di ujung barat Indonesia dengan keindahan bawah laut yang luar biasa",
      location: "Pulau Weh, Sabang, Aceh",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Taman Safari Indonesia",
      price: 0,
      description: "Taman hiburan keluarga dengan berbagai satwa liar di Cisarua, Bogor",
      location: "Taman Safari Indonesia, Cisarua, West Java",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Gunung Merbabu",
      price: 50000,
      description: "Gunung yang terletak di Jawa Tengah dengan pemandangan matahari terbit yang indah",
      location: "Gunung Merbabu, Central Java",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pulau Lombok",
      price: 0,
      description: "Pulau di Indonesia yang terkenal dengan keindahan pantainya",
      location: "Pulau Lombok, West Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Tanjung Lesung",
      price: 100000,
      description: "Kawasan wisata pantai di Banten yang cocok untuk bersantai dan berenang",
      location: "Tanjung Lesung, Pandeglang, Banten",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
  ];

  try {
    const newPlaces = await Promise.all(
      places.map(async (place) => {
        try {
          let geoData = await hereMaps.geometry(place.location);
          if (!geoData) {
            geoData = { type: "Point", coordinates: [116.32883, -8.90952] };
          }
          return {
            ...place,
            author: "656c6b809e6cd79e37408281",
            images: [
              {
                url: `public/images/image-1681876521153-260851838.jpg`, // Ubah sesuai dengan path dan nama file gambar yang ingin Anda gunakan
                filename: "image-1681876521153-260851838.jpg",
              },
            ],
            geometry: geoData,
          };
        } catch (error) {
          console.error("Error obtaining position data:", error);
          return null;
        }
      })
    );

    await Place.deleteMany({});

    // Memasukkan data baru ke dalam database menggunakan insertMany()
    const insertedPlaces = await Place.insertMany(newPlaces.filter(Boolean)); // Filter nilai null

    console.log("Data inserted:", insertedPlaces);
  } catch (error) {
    console.error("Error saving data:", error);
  } finally {
    mongoose.disconnect();
  }
}
