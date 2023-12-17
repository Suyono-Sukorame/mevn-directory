const axios = require("axios");
const ExpressError = require("./ExpressError");

const geocode = async (address) => {
  try {
    const baseUrl = `https://geocode.search.hereapi.com/v1`;
    const apiKey = `8aKkiBoexHt67Hvnd8nin0XYECrOUVB7Lzla6cqXfss`;

    const url = `${baseUrl}/geocode?q=${address}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.items && data.items.length > 0) {
      const lat = data.items[0].position.lat;
      const lng = data.items[0].position.lng;
      return { lat, lng };
    } else {
      throw new Error("No geocode data found for the provided address");
    }
  } catch (err) {
    throw new ExpressError(err.message, 500);
  }
};

const geometry = async (location) => {
  try {
    const encodedLocation = encodeURIComponent(location);
    const apiKey = `8aKkiBoexHt67Hvnd8nin0XYECrOUVB7Lzla6cqXfss`;
    const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodedLocation}&apiKey=${apiKey}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.items && data.items.length > 0) {
      const position = data.items[0].position;
      return { type: "Point", coordinates: [position.lng, position.lat] };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error obtaining position data: ${error.message}`);
  }
};

module.exports = {
  geocode,
  geometry,
};
