const user = require('../../models/user.model')
module.exports = async (req,res)=>{
    try {
        const _id = req.user.userId
        const info = await user.findById({_id});
        if(!info)
            return res.status(401).json("Something went wrong")
        return res.status(200).json(info)
    } catch (error) {
        console.error('Get Profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}