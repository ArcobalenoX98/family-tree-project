// routes/family.js
const express = require('express');
const router = express.Router();
const Member = require('../models/FamilyMember');

// 将 Mongoose 文档格式化成前端需要的节点格式
function toF3Node(doc) {
  return {
    id: doc._id.toString(),
    rels: {
      spouses: Array.isArray(doc.spouses)  ? doc.spouses.map(id => id.toString())  : [],
      children: Array.isArray(doc.children) ? doc.children.map(id => id.toString()) : [],
      father: Array.isArray(doc.father) && doc.father.length > 0 ? doc.father[0].toString()  : null,
      mother: Array.isArray(doc.mother) && doc.mother.length > 0 ? doc.mother[0].toString()  : null
    },
    data: {
      'first name': doc.firstName,
      'last name' : doc.lastName,
      birthday    : doc.birthday,
      avatar      : doc.avatar,
      gender      : doc.gender   // 存的是 'M' 或 'F'
    }
  };
}

// GET /api/family
// 返回 [ { id, rels:{spouses,children}, data:{…} }, … ]
router.get('/', async (req, res) => {
  try {
    const docs = await Member.find({});
    res.json(docs.map(toF3Node));
  } catch (err) {
    console.error('GET /api/family error:', err);
    res.status(500).json({ error: err.message });
  }
});

// —— 新增：GET /api/family/:id ——  
router.get('/:id', async (req, res) => {
  try {
    const doc = await Member.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Member not found' });
    res.json(toF3Node(doc));
  } catch (err) {
    console.error(`GET /api/family/${req.params.id} error:`, err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/family
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthday = null,
      avatar = '',
      gender,
      father = [],
      mother = [],
      spouses = [],
      children = []
    } = req.body;

    const member = new Member({
      firstName,
      lastName,
      birthday,
      avatar,
      gender,
      father,
      mother,
      spouses,
      children
    });

    const saved = await member.save();
    res.status(201).json(toF3Node(saved));
  } catch (err) {
    console.error('POST /api/family error:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/family/:id
router.put('/:id', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthday = null,
      avatar = '',
      gender,
      father = [],
      mother = [],
      spouses = [],
      children = []
    } = req.body;

    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, birthday, avatar, gender, father, mother, spouses, children },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(toF3Node(updated));
  } catch (err) {
    console.error(`PUT /api/family/${req.params.id} error:`, err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/family/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(`DELETE /api/family/${req.params.id} error:`, err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;