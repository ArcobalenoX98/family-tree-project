const jwt = require('jsonwebtoken');

const auth = (req,res,next) =>{
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({ message: 'Access was denied as no token was provided---未提供token,访问被拒绝'});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded; //将解码信息附加到req.user
        next();
    }catch(err){
        console.error('JWT verification failed --- JWT验证失败',err.message);
        res.status(401).json({ message: '无效的token,访问被拒绝'});
    }
};

module.exports = auth;