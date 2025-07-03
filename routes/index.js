const home = require('./home/home')
const register = require('./auth/register')
const login = require('./auth/login')
const apiReset = require('./setting/apiReset')
const url = require('./url/url')
const redirect = require('./url/redirect')
module.exports = {
    home,
    register,
    login,
    apiReset,
    url,
    redirect
}