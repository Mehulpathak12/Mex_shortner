const express = require('express');
const router = express.Router();
const { body} = require('express-validator');
const auth = require('../../middlewares/auth');
router.post(
  '/create',
  auth,
  [
    body('originalUrl').isURL().withMessage('Valid originalUrl required'),
    body('password').optional().isString(),
    body('expiresAt').optional().isInt(),
    body('clickLimit').optional().isInt({ min: 1 }),
  ],
  require('../../controllers/url/user.createURL')
);

router.post(
  '/create/token',
  [
    body('originalUrl').isURL().withMessage('Valid originalUrl required'),
    body('password').optional().isString(),
    body('expiresAt').optional().isInt(),
    body('clickLimit').optional().isInt({ min: 1 }),
  ],
  require('../../controllers/url/user.createAPIwithToken')
);

module.exports = router;
