const express = require('express');
const multer  = require('multer');
const Profile = require('../models/Profile');
const router  = express.Router();

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

// 获取唯一一条（upsert 时可用 PUT）
router.get('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) {
    next(err);
  }
});

// 更新／创建（支持单文件上传：字段名 avatar）
router.put('/', upload.single('avatar'), async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      bio: req.body.bio,
    };
    // 如果上传了文件，就用文件路径，否则使用前端传来的 avatar URL
    if (req.file) {
      data.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      data.avatar = req.body.avatar;
    }
    const profile = await Profile.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;