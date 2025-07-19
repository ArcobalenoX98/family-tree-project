// server/routes/family.js
const express = require('express');
const router = express.Router();
const Member = require('../models/FamilyMember');

// GET /api/family
router.get('/', async (req, res) => {
  try {
    // 1) 拉取所有成员
    const docs = await Member.find({});

    // 2) 映射到 f3 格式
    const treeData = docs.map(doc => ({
      id: doc._id.toString(),
      rels: {
        spouses: Array.isArray(doc.spouses)
          ? doc.spouses.map(id => id.toString())
          : [],
        children: Array.isArray(doc.children)
          ? doc.children.map(id => id.toString())
          : []
      },
      data: {
        'first name': doc.firstName || doc.name.split(' ')[0] || '',
        'last name': doc.lastName || doc.name.split(' ')[1] || '',
        birthday: doc.birthDate
          ? new Date(doc.birthDate).getFullYear()
          : null,
        avatar: doc.avatarUrl || '',
        gender: doc.gender || ''
      }
    }));

    // 3) 返回给前端
    res.json(treeData);
  } catch (err) {
    console.error('Error in /api/family', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;