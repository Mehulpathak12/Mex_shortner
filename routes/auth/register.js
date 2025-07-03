const express = require('express');
const app = express.Router();
const { body, validationResult } = require('express-validator');
app.route("/register").get((req,res)=>{
    res.status(200).json({
        "req":"working"
    })
}).post([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
require('../../controllers/registration/registerPostFun')
);
module.exports = app