const express = require('express');
const Profile = require('../models/Profile');
const router  = express.Router();

// 取唯一一条（upsert 时可用 PUT）
router.get('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) { next(err) }
});

// 更新／创建
router.put('/', async (req, res, next) => {
  try {
    const data = { name: req.body.name, avatar: req.body.avatar, bio: req.body.bio };
    const profile = await Profile.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(profile);
  } catch (err) { next(err) }
});

module.exports = router;