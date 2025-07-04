const express = require("express");
const path = require('path')
const cookieParser = require('cookie-parser');
const app = express();
const dbConfig = require('./config/dbConfig')
const rootDir = require('./utils/dirname')
require('dotenv').config();
const {home,register,login,apiReset,url,redirect,userDetail,changePWD, allURL, analytics, deleteURL} = require('./routes')
dbConfig()
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(rootDir, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(home)
app.use("/api/",register)
app.use("/api/",login)
app.use("/api/",apiReset)
app.use("/api/",url)
app.use("/api/",userDetail)
app.use("/api/",changePWD) 
app.use("/api/",allURL)
app.use("/api/",analytics)
app.use("/api/",deleteURL)
app.use(redirect)

module.exports =  app