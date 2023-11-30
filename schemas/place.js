const Joi = require("joi");

module.exports.placeSchema = Joi.object({
  place: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow(null, ""), // Mengizinkan field "image" kosong atau bernilai null
  }).required(),
});
