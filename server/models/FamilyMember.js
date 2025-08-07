// models/FamilyMember.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
  firstName: { type: String,required: true},
  lastName: { type: String,required: true},
  // 存储出生年份
  birthday: { type: Number, default: null },
  gender:{ type:String,  default:null,require:true },
  // 关系字样
  father: [{ type: Schema.Types.ObjectId, ref: 'Member'}],
  mother: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  spouses: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  children: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  // 对应前端 data.avatar
  avatar: { type: String, default: '' },
  // 不再存 bio（前端 data 中无此字段）
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);