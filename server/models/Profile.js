// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  avatar:  { type: String },   // URL
  bio:     { type: String },
});

module.exports = mongoose.model('Profile', ProfileSchema);