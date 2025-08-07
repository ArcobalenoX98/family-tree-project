// server.index.js
const path = require('path');

const express = require('express');
const cors = require('cors');
require('dotenv').config();


const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes');  //挂载路由的位置
const familyRoutes = require('./routes/family');
const postsRoute = require('./routes/posts');
const slidesRoute = require('./routes/slides');
const profileRoute = require('./routes/profile');

// —— 新增：引入 mongoose 和 Family 模型，并定义初始成员数据 —— 
const mongoose = require('mongoose');
const Family   = require('./models/FamilyMember');

const initialMembers = [
  {
    _id: new mongoose.Types.ObjectId('68842a212c952fd89013b734'),
    firstName: '2222',
    lastName:  '3333',
    birthday:  4444,
    avatar:    'https://avatar.com/meimei.jpg',
    gender:    'F',
    rels:      { children: [], father: [], mother: [], spouses: [] },
    main:      true
  },
  {
    _id: new mongoose.Types.ObjectId('688574442b53d848f95e4d6b'),
    firstName: 'wwww',
    lastName:  'wwww',
    birthday:  1111111,
    avatar:    'wwwwww',
    gender:    'F',
    rels:      { children: [], father: [], mother: [], spouses: [] },
    // main 默认为 false，可不写
  }
];

//console.log('** membersRouter loaded **');
const { get } = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

//middle part  用来解析请求，包括json代码，URL代码
app.use(cors({
    methods:['GET','POST','PUT','DELETE','OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
//app.use('uploads',express.static('uploads'));

app.use((req, res, next) => {
  console.log("🔥 middle part already been triggered");
  next();
});

// 关键配置：暴露 uploads 目录为静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routing using example
app.use('/api/users',userRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/family',  require('./routes/family'));
app.use('/api/posts',postsRoute);
app.use('/api/slides',slidesRoute);
app.use('/api/profile',profileRoute);


app.get('/',(req,res) => {
  res.status(200).json({ message: 'Members route is working'});
})
app.get('/api/users/test', (req, res) => {
  res.send('the route hangs on the authentication successful');
});
app.get('/api/posts', (req, res) => {
  // 返回包含媒体路径的数据
  res.json([{
    id: 1,
    imageUrl: '/uploads/post1.jpg'  // 前端访问的路径
  }]);
});


//Starting Database then Starting server
connectDB().then(() =>{
  (async function start() {
    try {
      // 1) 连接数据库
      await connectDB();

      // 2) 如果 Family 集合空了，就插入初始成员
      const count = await Family.countDocuments();
      if (count === 0) {
        console.log('🔧 数据库为空，正在插入初始成员…');
        await Family.insertMany(initialMembers);
        console.log('✅ 初始成员插入完毕');
      }

      // 3) 启动 Express 服务
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('启动失败:', err);
      process.exit(1);
    }
  })();
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Server Error' });
});
