const home = require('./home/home')
const register = require('./auth/register')
const login = require('./auth/login')
const apiReset = require('./setting/apiReset')
const url = require('./url/url')
const redirect = require('./url/redirect')
const userDetail = require('./user/user.getDetail')
const changePWD = require('./user/user.changePassword')
const allURL = require('./user/allUrl')
const analytics = require('./analytics/getReport')
const deleteURL = require('./url/deleteURL')
module.exports = {
    home,
    register,
    login,
    apiReset,
    url,
    redirect,
    userDetail,
    changePWD,
    allURL,
    analytics,
    deleteURL
}