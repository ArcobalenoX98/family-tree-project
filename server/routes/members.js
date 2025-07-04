const express = require('express');
const router = express.Router();
const Member = require('../models/FamilyMember');

//post /api/members
router.post('/',async(req,res) =>{
    try{
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    }catch(err){
        res.status(400).json({ error: err.message});
    }
});

module.exports = router;