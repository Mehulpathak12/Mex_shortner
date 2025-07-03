const User = require('../../models/user.model')
const crypto = require('crypto');
module.exports = async (req,res) => {
    try {
        const userId = req.user.userId;
    
        const newApiKey = generateApiKey();
    
        const user = await User.findByIdAndUpdate(
          userId,
          { apikey: newApiKey, updatedAt: Date.now() },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        res.status(200).json({
          success: true,
          message: 'API key reset successfully',
          apikey: newApiKey,
        });
      } catch (err) {
        console.error('Reset API error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
      }
}
function generateApiKey() {
    const apiKey = crypto.randomBytes(32).toString('hex');
    return apiKey
}