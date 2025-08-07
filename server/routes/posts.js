//import bodyParser from 'body-parser'
const bodyParser = require('body-parser');
const express = require('express');
const multer  = require('multer');
const Post    = require('../models/Post');
const router  = express.Router();


//middlepart
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// 使用磁盘存储：将上传文件保存在项目根目录的 uploads/ 目录
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Not found');
  res.json(post);
});

// 创建：支持文本 + 可选多文件(图片/视频)
router.post('/', upload.array('media'), async (req, res) => {
  // 1. 解析 req.body.title, .type, .content
  // 2. 对 req.files 逐个上传到文件存储（本地 / AWS S3 / COS 等），获取 url 和 mimeType
  // 3. 拼装 media 数组
  // 4. 新建文档
  const media = req.files.map(f => ({
    url: `/uploads/${f.filename}`, // 本地静态资源访问路径
    mimeType: f.mimetype,
  }));
  const post = await Post.create({
    title:   req.body.title,
    type:    req.body.type,
    content: req.body.content,
    media,
  });
  res.status(201).json(post);
});

router.put('/:id', upload.array('media'), async (req, res) => {
  const updates = {
    title: req.body.title,
    type:  req.body.type,
    content: req.body.content,
    updatedAt: Date.now(),
  };
  if (req.files.length) {
    const media = req.files.map(f => ({
      url: `/uploads/${f.filename}`, // 本地静态资源访问路径
      mimeType: f.mimetype,
    }));
    updates.media = media;
  }
  const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!post) return res.status(404).send('Not found');
  res.json(post);
});

router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;