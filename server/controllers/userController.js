const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async(req,res) =>{
    console.log('receive the registry request:',req.body);

    const{ email,password,nickname } = req.body;
    if(!email || !password){
        console.log('缺少必要字段')
        return res.status(400).json({ message: 'Required fields are missing'})
    }

    try{
        //check the user regist or not
        const existingUser = await User.findOne({ email });
        console.log('existingUser:',existingUser);

        if(existingUser){
            return res.status(400).json({ message:'The email address has already been registed'});
        }
        
        //check passwords requiement 
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({
                message:'Password must be at least 8 characters with letters and numbers'
            });
        }

        //encrypt the passwords
        const hashedPassword = await bcrypt.hash(password,10);

        //create Users
        const newUser = new User({
            email,
            password:hashedPassword,
            nickname,
        });

        await newUser.save();

        res.status(201).json({ message: 'regist success', userId:newUser._id });
    }catch(err){
        console.error('Registration error:',err);
        const errorMsg = err.code === 11000
            ? 'Email already exists'
            : 'Server error';
        res.status(500).json({ message: 'Registration failed: ${errorMsg}'})
    }
};

module.exports = { register };