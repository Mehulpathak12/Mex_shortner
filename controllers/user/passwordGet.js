const bcrypt = require('bcrypt');
const User = require('../../models/user.model')
module.exports = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required' });
    }
  
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(403).json({ success: false, message: 'Current password is incorrect' });
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
  
      res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
      console.error('Password change error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }