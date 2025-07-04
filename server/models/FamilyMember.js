const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
    name:{ type:String,required:true },
    gender:{ type:String,enum:['male','female'],require:true},
    birthDate:Date,
    parents:[{ type:Schema.Types.ObjectId,ref:'Member'}],
    spouses:[{ type:Schema.Types.ObjectId,ref:'Member'}],
    children:[{ type:Schema.Types.ObjectId,ref:'Member'}],
    photoUrl:String,
    bio:String,
},{timestamps:true});

module.exports = mongoose.model('Member',memberSchema);