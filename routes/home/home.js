const express = require("express");
const app = express.Router()
const crypto = require('crypto');
app.get("/", (req, res) => {
    res.status(200).json("Home page")
});

app.get('/q', (req, res) => {
    const apiKey = crypto.randomBytes(32).toString('hex');  
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip && ip.includes('::ffff:')) {
        ip = ip.split('::ffff:')[1];
    }
    console.log('Client IP:', ip);
    res.json(apiKey)
  });
module.exports = app