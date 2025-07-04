const express = require('express');
const Url = require('../../models/url');
const User = require('../../models/user.model');
const Click = require('../../models/clickCount');

const router = express.Router();

// DELETE /api/url/:slug
router.delete('/:slug',require('../../middlewares/auth'), async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    // 1. Find URL by slug and user ID
    const url = await Url.findOne({ slug, userId });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found or not yours' });
    }

    // 2. Get click count before deletion
    const deletedClickCount = url.clickCount || 0;

    // 3. Delete the URL
    await Url.deleteOne({ _id: url._id });

    // 4. Delete associated click records
    await Click.deleteMany({ urlId: url._id });

    // 5. Update user's usage stats
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          'usage.totalUrls': -1,
          'usage.totalClicks': -deletedClickCount,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Short URL deleted successfully',
      deletedSlug: slug,
      clicksRemoved: deletedClickCount
    });
  } catch (err) {
    console.error('Error deleting URL:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
