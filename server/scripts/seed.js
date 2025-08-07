// scripts/seed.js
const mongoose = require('mongoose');
const Family = require('../models/FamilyMember'); // 假设你的 Mongoose 模型叫 Family

const initialMembers = [
  {
    id: '68842a212c952fd89013b734',
    data: { firstName: '2222', lastName: '3333', birthday: 4444, avatar: 'https://avatar.com/meimei.jpg', gender: 'F' },
    rels: { children: [], father: [], mother: [], spouses: [] },
    main: true
  },
  {
    id: '688574442b53d848f95e4d6b',
    data: { firstName: 'wwww', lastName: 'wwww', birthday: 1111111, avatar: 'wwwwww', gender: 'F' },
    rels: { children: [], father: [], mother: [], spouses: [] }
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/your-db-name');
  console.log('🗄️ 连接数据库成功，开始清空旧数据');
  await Family.deleteMany({});
  console.log('🧹 数据库已清空，开始插入初始数据');
  await Family.insertMany(initialMembers);
  console.log('✅ 初始数据插入完毕');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});