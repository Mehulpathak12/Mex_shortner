const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Url = require('../../models/url');
const user =  require('../../models/user.model')
const {validationResult} = require('express-validator')
const generateSlug = () => Math.random().toString(36).substring(2, 8);
module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { originalUrl, password, expiresAt, clickLimit } = req.body;

    try {
      const slug = generateSlug();
      const baseUrl = req.protocol + '://' + req.get('host');
      const shortUrl = `${baseUrl}/${slug}`;
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      const newUrl = new Url({
        userId: req.user.userId,
        originalUrl,
        slug,
        shortUrl,
        password: hashedPassword,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        clickLimit: clickLimit || null,
        createdByIp: req.ip
      });

      const userDb = await user.updateOne(
        { _id: '68654dfb4a6cebf2794bcdc0' },
        { $inc: { 'usage.totalUrls': 1 } }
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