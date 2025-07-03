const express = require('express');
const router = express.Router();
const Url = require('../../models/url');
const click = require('../../models/clickCount')
const user = require('../../models/user.model')
const bcrypt = require('bcrypt');
const redis = require('../../config/redisClient');

router.get('/:slug', async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const urlData = await Url.findOne({ slug });
    if (!urlData || !urlData.isActive) {
      return res.status(404).render('error', { message: 'Link not found or inactive' });
    }

    if (urlData.expiresAt && new Date() > urlData.expiresAt) {
      urlData.isActive = false;
      await urlData.save();
      return res.status(410).render('error', { message: 'Link expired' });
    }

    if (urlData.clickLimit !== null && urlData.clickCount >= urlData.clickLimit) {
      urlData.isActive = false;
      await urlData.save();
      return res.status(410).render('error', { message: 'Click limit reached' });
    }

    if (urlData.password) {
      return res.render('password', { slug, error:false });
    }

    return await handleRedirect(req, res, urlData);
  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: 'Server error' });
  }
});

router.post('/:slug', async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const password  = req.body.password;
  
  try {
    const urlData = await Url.findOne({ slug });
    if (!urlData || !urlData.isActive) {
      return res.status(404).render('error', { message: 'Invalid or expired link' });
    }

    const isMatch = await bcrypt.compare(password, urlData.password || '');
    if (!isMatch) {
      return res.render('password', { slug, error: 'Incorrect password. Try again.' });
    }
    return await handleRedirect(req, res, urlData);
  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: 'Server error' });
  }
});

async function handleRedirect(req, res, urlData) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const alreadyClicked = await hasRecentlyClicked(urlData.slug, ip);
  if (!alreadyClicked) {
    urlData.clickCount += 1;
    await urlData.save();
    let da = await click.create({
      urlId:urlData._id,
      slug:urlData.slug,
      userId:urlData.userId,
      ip:ip,
    })
    const updatedUser = await user.findByIdAndUpdate(
      urlData.userId,
      { $inc: { 'usage.totalClicks': 1 } },
      { new: true } 
    );
    await markClick(urlData.slug, ip);
  }

  return res.redirect(urlData.originalUrl);
}
async function hasRecentlyClicked(slug, ip) {
  const key = `click:${slug}:${ip}`;
  const exists = await redis.exists(key);
  return exists;
}

async function markClick(slug, ip) {
  const key = `click:${slug}:${ip}`;
  await redis.set(key, '1', { EX: 3600 }); // 1 hour expiry
}

module.exports = router;
