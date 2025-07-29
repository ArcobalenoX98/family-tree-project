// server.index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes');  //挂载路由的位置
const membersRouter = require('./routes/members');
const postsRoute = require('./routes/posts');
const slidesRoute = require('./routes/slides');
const profileRoute = require('./routes/profile');

console.log('** membersRouter loaded **');
const { get } = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

//middle part  用来解析请求，包括json代码，URL代码
app.use(cors({
    methods:['GET','POST','PUT','DELETE','OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use((req, res, next) => {
  console.log("🔥 middle part already been triggered");
  next();
});

//routing using example
app.use('/api/users',userRoutes);
app.use('/api/members',membersRouter);
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

//Starting Database then Starting server
connectDB().then(() =>{
    app.listen(PORT,() =>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Server Error' });
});
