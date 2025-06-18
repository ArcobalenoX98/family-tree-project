// server.index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//middle part
app.use(cors());
app.use(express.json());

//routing example
app.get('/',(req,res) => {
    res.send('Family Tree API Running!');
});

//Starting service
app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});