const express = require('express');
const router = express.Router();

// POST /api/change-password
router.post('/change-password',require('../../middlewares/auth'), require('../../controllers/user/passwordGet'));

module.exports = router;
