const express = require('express');
const multer          = require('multer');
const CarouselSlide   = require('../models/CarouselSlide');
const router          = express.Router();

// === Multer 配置：存储到项目根目录 uploads/ 下，文件名加时间戳 ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 列表
router.get('/', async (req, res, next) => {
  try {
    const slides = await CarouselSlide.find().sort({ order: 1 });

    // 👉 在这里打印查询到的数量和数据，帮助排查
    console.log('Fetched slides count =', slides.length);
    console.log('Slides data =', JSON.stringify(slides, null, 2));
    
    //返回json
    res.json(slides);
  } catch (err) {
    next(err);
  }
});

// 详情
router.get('/:id', async (req, res, next) => {
  try {
    const slide = await CarouselSlide.findById(req.params.id);
    if (!slide) return res.status(404).send('Not found');
    res.json(slide);
  } catch (err) {
    next(err);
  }
});

// 创建（支持单文件上传：字段名 image）
router.post('/', upload.array('image'), async (req, res) => {
  const created = await Promise.all(
    req.files.map(f =>
      CarouselSlide.create({
        title: req.body.title,
        order: req.body.order,
        imageUrl: `/uploads/${f.filename}`
      })
    )
  )
  res.status(201).json(created)
})

// 更新（支持单文件重新上传）
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const updates = {
      title: req.body.title,
      order: req.body.order,
    };
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updates.imageUrl = req.body.imageUrl;
    }
    const slide = await CarouselSlide.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!slide) return res.status(404).send('Not found');
    res.json(slide);
  } catch (err) {
    next(err);
  }
});

// 删除
router.delete('/:id', async (req, res, next) => {
  try {
    await CarouselSlide.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;