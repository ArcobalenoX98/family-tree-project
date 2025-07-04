const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async(req,res) =>{
    const { email, password } = req.body;

    try{
        //查找用户 find the User
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'User is not exist 用户不存在'})
        }

        //验证密码 check the password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Password is not correct 密码错误'});
        }

        //签发JWT issuing JWT
        const token = jwt.sign(
            {userId:user._id,email:user.email,role:user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h'}
        );

        res.status(200).json({ message: 'Login success 登陆成功',token});
    } catch(err){
        console.error('Login fail 登陆失败',err.message);
        res.status(500).json({ message: 'Server error 服务器错误'});
    }
};

module.exports = { login };