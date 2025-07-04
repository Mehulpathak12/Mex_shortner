const express = require("express");
const router = express.Router();

const userModel = require('../../models/user.model')
const urlModel = require('../../models/url')

router.get('/allURL',require('../../middlewares/auth'),async (req,res)=>{
    try {
        const _id = req.user.userId
        const urls = await urlModel.find({ userId:_id });
        
        res.status(200).json({
        success: true,
        count: urls.length,
        data: urls
        });
    } catch (error) {
        console.error('allURL error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
})

module.exports = router