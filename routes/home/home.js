const express = require("express");
const app = express.Router()
const crypto = require('crypto');
app.get("/", (req, res) => {
    res.status(200).render("index")
});
module.exports = app