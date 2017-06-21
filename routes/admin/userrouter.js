var express = require('express');
var router = express.Router();
var crypto = require('../../common/encrypt');
var RestMsg = require('../../common/restmsg'); // 引用restmsg模块
var UserService = require('../../service/user/userservice'); // 引用UserService模块


/**
 * 访问首页
 */
router.get('/', function (req, res) {
    res.render('admin', {"title": "Admin"});
});

/**
 * 注册
 */
router.route('/register')
    .get(function (req, res) {
        res.render('register', {"title": "Register"});
    })
// .post(function(req, res) {
//
// });

/**
 * 登录相关
 */
router.route('/login')
    .get(function (req, res) {
        res.render('login', {"title": "Login"});
    })
// .post(function(req, res) {
//
// });

/**
 * 退出登录
 */
router.get('/logout', function (req, res) {
    res.redirect('/admin/login')
});

module.exports = router;