const express = require('express');
const router = express.Router();
const { body} = require('express-validator');
const auth = require('../../middlewares/auth');
router.post(
  '/',
  auth,
  [
    body('originalUrl').isURL().withMessage('Valid originalUrl required'),
    body('password').optional().isString(),
    body('expiresAt').optional().isISO8601(),
    body('clickLimit').optional().isInt({ min: 1 }),
  ],
  require('../../controllers/url/user.createURL')
);

module.exports = router;
