// routes/index.js
const express = require('express');
const router = express.Router();
const Url = require('../models/url');

router.get('/', (req, res) => {
  res.render('index', {
    gaTrackingId: process.env.GA_TRACKING_ID,
    fbPixelId: process.env.FB_PIXEL_ID,
    baseUrl: process.env.BASE_URL
  });
});

router.get('/analytics', (req, res) => {
  res.render('analytics')
})

router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const ipAddress = req.ip;

  // Dynamically import nanoid
  const { nanoid } = await import('nanoid');
  const shortUrl = nanoid(6);

  const newUrl = new Url({ originalUrl, shortUrl, ipAddress });
  await newUrl.save();

  res.render('index', {
    shortUrl,
    gaTrackingId: process.env.GA_TRACKING_ID,
    fbPixelId: process.env.FB_PIXEL_ID,
    baseUrl: process.env.BASE_URL
  });
});

router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

module.exports = router;
