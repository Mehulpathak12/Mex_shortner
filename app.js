const express = require("express");
const path = require('path')
const app = express();
const dbConfig = require('./config/dbConfig')
const rootDir = require('./utils/dirname')
require('dotenv').config();
const {home,register,login,apiReset,url,redirect} = require('./routes')
dbConfig()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(rootDir, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(home)
app.use(register)
app.use(login)
app.use("/api/",apiReset)
app.use(url)
app.use(redirect)
app.get("/health",(req,res)=>{
    res.status(200).json({
        "working":true
    })
})

module.exports =  app