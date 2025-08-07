const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
        },
        nickname:{
            type:String,
            default:'Anonymous',
        },
        role:{
            type:String,
            enum:['admin','member','viewer'],
            default:'member',
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model('User',userSchema);