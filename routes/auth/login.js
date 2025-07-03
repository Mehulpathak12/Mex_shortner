const express = require('express')
const app = express.Router()
const { body } = require('express-validator');
app.route("/login").get((req,res)=>{
    res.status(200).json({
        "working":true
    })
}).post(
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    require('../../controllers/login/loginPostFun')
)

module.exports = app