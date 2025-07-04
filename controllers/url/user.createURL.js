const bcrypt = require('bcrypt');
const Url = require('../../models/url');
const user =  require('../../models/user.model')
const {validationResult} = require('express-validator')
const generateSlug = () => Math.random().toString(36).substring(2, 8);
module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { originalUrl, password, expiresAt, clickLimit } = req.body;
    let expiresAtDate = null;
    if (expiresAt && !isNaN(expiresAt)) {
      const days = parseInt(expiresAt);
      expiresAtDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    try {
      const slug = generateSlug();
      const baseUrl = req.protocol + '://' + req.get('host');
      const shortUrl = `${baseUrl}/${slug}`;
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const newUrl = new Url({
        userId: req.user.userId,
        originalUrl,
        slug,
        shortUrl,
        password: hashedPassword,
        expiresAt: expiresAtDate,
        clickLimit: clickLimit || null,
        createdByIp: ip
      });

      const userDb = await user.updateOne(
        { _id: req.user.userId },
        { $inc: { 'usage.totalUrls': 1 } },
        { new: true }
      );

      await newUrl.save();

      res.status(201).json({
        success: true,
        shortUrl,
        slug,
        expiresAt,
        clickLimit
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }