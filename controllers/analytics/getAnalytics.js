const Click = require("../../models/clickCount");
const Url = require("../../models/url");

exports.getAnalyticsBySlug = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.userId;

  try {
    // Step 1: Validate ownership of the slug
    const url = await Url.findOne({ slug, userId });
    if (!url) return res.status(404).json({ error: "Link not found or unauthorized" });

    // Step 2: Aggregate analytics from clicks
    const totalClicks = await Click.countDocuments({ slug, userId });

    const dailyClicks = await Click.aggregate([
      { $match: { slug, userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    const topIps = await Click.aggregate([
      { $match: { slug, userId } },
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Final response
    return res.json({
      slug,
      totalClicks,
      topIps,
      clicksPerDay: dailyClicks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
