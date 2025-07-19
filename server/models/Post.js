// models/Post.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  url:      { type: String, required: true },
  mimeType: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  type:      { type: String, enum: ['text','image-text','video-text'], required: true },
  content:   { type: String, required: true },      // 纯文本 or Markdown/HTML
  media:     [MediaSchema],                         // 图片或视频列表
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);