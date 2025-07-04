const bcrypt = require("bcrypt");
const Url = require("../../models/url");
const User = require("../../models/user.model");

const generateSlug = () => Math.random().toString(36).substring(2, 8);

// POST /api/shorten?apikey=your_key_here
module.exports = async (req, res) => {
  const apikey  = req.query.apikey;
  const { originalUrl, password, expiresAt, clickLimit } = req.body;

  if (!apikey) {
    return res.status(401).json({ success: false, message: "API key is required" });
  }

  try {
    // ✅ Validate API key
    const user = await User.findOne({ apikey });
    if (!user) {
      return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    // ✅ Prepare data
    const slug = generateSlug();
    const baseUrl = req.protocol + "://" + req.get("host");
    const shortUrl = `${baseUrl}/${slug}`;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let expiresAtDate = null;
    if (expiresAt && !isNaN(expiresAt)) {
      expiresAtDate = new Date(Date.now() + parseInt(expiresAt) * 24 * 60 * 60 * 1000);
    }

    const newUrl = new Url({
      userId: user._id,
      originalUrl,
      slug,
      shortUrl,
      password: hashedPassword,
      expiresAt: expiresAtDate,
      clickLimit: clickLimit || null,
      createdByIp: ip,
    });

    await newUrl.save();

    // ✅ Increment usage counter
    await User.updateOne(
      { _id: user._id },
      { $inc: { "usage.totalUrls": 1 } }
    );

    res.status(201).json({
      success: true,
      message: "Short URL created",
      shortUrl,
      slug,
      expiresAt: expiresAtDate,
      clickLimit
    });
  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
