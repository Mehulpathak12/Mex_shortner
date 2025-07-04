const express = require("express");
const app = express.Router();
app.get("/profile",require('../../middlewares/auth') ,require('../../controllers/user/getDetail'));

module.exports = app;