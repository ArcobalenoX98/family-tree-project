//userRoutes.js
const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');

router.get('/ping', (req, res) => {
  res.send('pong');
});

//write the register logic
router.post('/register', register);

module.exports = router;