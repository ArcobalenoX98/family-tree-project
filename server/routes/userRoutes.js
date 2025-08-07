//userRoutes.js
const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');
const { login } = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.get('/ping', (req, res) => {
  res.send('pong');
});

//write the register logic
router.post('/register', register);
router.post('/login',login);

//Protected API Test Routing --- 受保护 API 测试路由
router.get('/protected',auth,(req,res) =>{
  res.json({ message: 'protected routing access succeed --- 受保护路由访问成功',user: req.user });
});

module.exports = router;