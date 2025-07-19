const express = require('express');
const router = express.Router();
const Member = require('../models/FamilyMember');
const { body,validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
const { generateCodeFrame } = require('vue/compiler-sfc');

//post /api/members
router.post(
    '/',
    [
        body('name')
            .notEmpty().withMessage('name为必填信息'),
        body('gender')
            .optional()
            .isIn(['male','female']).withMessage('gender 必须是male或female'),
        body('birthDate')
            .optional()
            .isISO8601().withMessage('birthDate 必须是 ISO8601 日期'),
        body('parents')
            .optional()
            .isArray().withMessage('parents 必须是数组'),
        body('parents.*')
            .optional()
            .isMongoId().withMessage('parents 中的每一项都必须是有效的ObjectId'),
        body('spouses')
            .optional()
            .isArray().withMessage('spouses 必须是数组'),
        body('spouses.*')
            .optional()
            .isMongoId().withMessage('spouses 中的每一项都必须是有效的 ObjectId'),
        body('children')
            .optional()
            .isArray().withMessage('children 必须是数组'),
        body('children.*')
            .optional()
            .isArray().withMessage('children 中的每一项都必须是有效的 ObjectId'),
    ],
    async(req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ error: errors.array() });
        }
        //校验通过后才保存
        try{
            const member = new Member(req.body);
            await member.save();

            //Relationship synchronization 关系同步
            //如果传了parents，就把新成员的ID推到每个父母的 children数组
            if(req.body.parents && req.body.parents.length){
                await Member.updateMany(
                    { _id:{ $in:req.body.parents }},
                    { $addToSet:{children:member._id}}
                );
            }

            //2 如果传了spouses,互相推到spouses 数组
            if(req.body.spouses && req.body.spouses.length){
                //2.1将新成员推到配偶的spouses
                await Member.updateMany(
                    { _id: { $in:req.body.spouses }},
                    { $addToSet: { spouses: member._id }}
                );
            }

            //3 如果传了children，就把新成员ID推送到每个子女的parents 数组
            if(req.body.children && req.body.children.length){
                await Member.updateMany(
                    { _id: { $in:req.body.children } },
                    { $addToSet: { parents: member._id } }
                );
            }
            res.status(201).json(member);
        }catch(err){
            res.status(500).json({ errors: err.message });
        }
    }
);

//Get /api/members/:id
router.get('/:id',async(req,res) => {
    try{
        const member = await Member.findById(req.params.id);
        if(!member){
            return res.status(404).json({ error:'Member not found'});
        }
        res.json(member);
    }catch(err){
        res.status(500).json({ error: err.message});
    }
});

//Get /api/members/:id/tree - 获取某成员的祖先后代
router.get('/:id/tree',async(req,res) => {
    const { id } = req.params;
    //1、格式校验
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error: 'Invalid member ID'});
    }

    try{
        const result = await Member.aggregate([
            //匹配本体
            { $match:{ _id: new mongoose.Types.ObjectId(id) } },
            //递归查询所有祖先
            {
                $graphLookup:{
                    from:'members',
                    startWith:'$parents',
                    connectFromField:'parents',
                    connectToField:'_id',
                    as:'ancestors',
                    depthField:'generationAbove'
                }
            },
            //递归查询所有后代
            {
                $graphLookup:{
                    from:'members',
                    startWith:'$children',
                    connectFromField:'children',
                    connectToField:'_id',
                    as:'descendants',
                    depthField:'generationBelow'
                }
            },
            //可选：只返回需要的字段
            {
                $project:{
                    name:1,
                    gender:1,
                    birthData:1,
                    parent:1,
                    children:1,
                    ancestors:{
                        _id:1,name:1,parent:1,generationAbove:1
                    },
                    descendants:{
                        _id:1,name:1,children:1,generationBelow:1
                    }
                }
            }
        ]);

        if(!result.length){
            return res.status(404).json({ error: 'Member not found'});
        }
        //聚合结果是个数组，取第一个元素
        res.json(result[0]);
    }catch(err){
        res.status(500).json({ error:err.message })
    }
})

// PUT api/members/:id - 更新成员及其关系
router.put('/:id',
    [
        //ID 格式校验
        (req,res,next) => {
            if(!mongoose.Types.ObjectId.isValid(req.params.id) ){
                return res.status(400).json ({ error:'Invalid member ID'});
            }
            next();
        },
        //字段校验（同 POST）
        body('name').optional().notEmpty().withMessage('name 不可为空'),
        body('gender').optional().isIn([ 'male','female','other'])
            .withMessage('gender 必须是male或female'),
        body('birthDate').optional().isISO8601()
            .withMessage('birthDate 必须是 ISO8601 日期'),
        body('parents').optional().isArray().withMessage('parents 必须是数组'),
        body('parents.*').optional().isMongoId()
            .withMessage('parents 中的每一项必须是有效的ObjectId'),
        body('spouses').optional().isArray().withMessage('spouses'),
        body('spouses.*').optional().isMongoId()
            .withMessage('spouses 中每一项都必须是有效的ObjectId'),
        body('children').optional().isArray().withMessage('children必须是数组'),
        body('children.*').optional().isMongoId()
            .withMessage('children 中的每一项必须是有效的ObjectId')
    ],
    async(req,res) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({ error: error.array() });
        }

        const memberId = req.params.id;
        const updates = { ...req.body};

        try{
            //1.取出旧数据
            const old = await Member.findById(memberId);
            if(!old) return res.status(404).json({ error: 'Member not found'});

            //2.差量计算
            const diff = (field) =>{
                const before = old[field].map(String);
                const after = (req.body[field]|[]).map(String);
                return {
                    add: after.filter(x => !before.includes(x)),
                    del: before.filter(x => !after.includes(x))
                };
            };

            //3.更新主文档
            const updated = await Member.findByIdAndUpdate(memberId,updates,{new:true })

            //4.同步关系
            const relations = ['parents', 'spouses', 'children'];

            for (const field of relations) {
                // 旧关系数组（schema 定义的数组若未设置 default 会是 undefined，这里兜底成 []）
                const beforeArr = Array.isArray(old[field]) ? old[field].map(String) : [];
                // 请求体里传的新关系数组，空则默认 []
                const afterArr  = Array.isArray(req.body[field]) ? req.body[field].map(String) : [];

                // 差集：要删掉的ID和要新增的ID
                const toDelete = beforeArr.filter(id => !afterArr.includes(id));
                const toAdd    = afterArr.filter(id => !beforeArr.includes(id));

                // 删除：在对方文档里把本成员 ID pull 掉
                if (toDelete.length) {
                    await Member.updateMany(
                    { _id: { $in: toDelete } },
                    { $pull: { [opposite(field)]: memberId } }
                    );
                }

                // 添加：在对方文档里把本成员 ID addToSet
                if (toAdd.length) {
                    await Member.updateMany(
                    { _id: { $in: toAdd } },
                    { $addToSet: { [opposite(field)]: memberId } }
                    );
                }
            }            

            return res.json(updated);
        }catch(err){
            return res.status(500).json({ error: err.message});
        }
    }
);

//辅助：根据字段名，返回另一个文档里对应的反响字段
function opposite(field){
    switch(field){
        case 'parents': return 'children';
        case 'children' : return 'parents';
        case 'spouses' : return 'spouses';
    }
}

//DELETE api/members/:id  --- 删除成员并清理所有关联
router.delete('/:id',async (req,res) => {
    const { id } = req.params;

    //1.校验ID
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error: 'Invalid member ID'});
    }

    try{
        //2.找到要删除的成员
        const member = await Member.findById(id);
        if(!member){
            return res.status(404).json({ error: 'Member not found '});
        }

        //3.清理父母文档中的children 引用
        if(Array.isArray(member.parents) && member.parents.length){
            await Member.updateMany(
                { _id:{ $in:member.parents }},
                { $pull: { children: member._id }}
            );
        }

        //4.清理配偶文档中的spouses 引用
        if(Array.isArray(member.spouses) && member.spouses.length){
            await Member.updateMany(
                { _id: { $in:member.spouses } },
                { $$pull: { spouses: member._id } }
            );
        }

        //5.清理子女文档中的 parents 引用
        if(Array.isArray(member.children) && member.children.length){
            await Member.updateMany(
                { _id: { $in: member.children } },
                { $pull: { parents: member._id } }
            );
        }

        //6.删除成员本身
        await Member.deleteOne({ _id:member._id});

        return res.json({ message: 'Member deleted succesfully'});
    }catch(err){
        return res.status(500).json({ error:err.message });
    }
});


module.exports = router;