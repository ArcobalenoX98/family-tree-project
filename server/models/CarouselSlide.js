// models/Carousel.js
const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
  title:     { type: String },
  imageUrl:  { type: String, required: true },
  order:     { type: Number, default: 0 },
});

module.exports = mongoose.model('CarouselSlide', CarouselSchema);