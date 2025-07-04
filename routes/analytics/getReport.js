const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth"); // your JWT middleware
const { getAnalyticsBySlug } = require("../../controllers/analytics/getAnalytics");

router.get("/analytics/:slug", auth, getAnalyticsBySlug);

module.exports = router;
