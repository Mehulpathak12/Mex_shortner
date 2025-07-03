const express = require("express");
const app = express.Router();
const auth = require('../../middlewares/auth')
app.route("/resetAPI").get(auth,require('../../controllers/setting/user.resetAPI'))
module.exports = app