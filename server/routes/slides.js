const express = require('express');
const CarouselSlide = require('../models/CarouselSlide');
const router  = express.Router();

// 列表
router.get('/', async (req, res, next) => {
  try {
    const slides = await CarouselSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) { next(err) }
});

// 详情
router.get('/:id', async (req, res, next) => {
  try {
    const slide = await CarouselSlide.findById(req.params.id);
    if (!slide) return res.status(404).send('Not found');
    res.json(slide);
  } catch (err) { next(err) }
});

// 创建
router.post('/', async (req, res, next) => {
  try {
    const slide = await CarouselSlide.create({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      order: req.body.order || 0,
    });
    res.status(201).json(slide);
  } catch (err) { next(err) }
});

// 更新
router.put('/:id', async (req, res, next) => {
  try {
    const slide = await CarouselSlide.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, imageUrl: req.body.imageUrl, order: req.body.order },
      { new: true }
    );
    if (!slide) return res.status(404).send('Not found');
    res.json(slide);
  } catch (err) { next(err) }
});

// 删除
router.delete('/:id', async (req, res, next) => {
  try {
    await CarouselSlide.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err) }
});

module.exports = router;