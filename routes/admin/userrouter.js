var express = require('express');
var router = express.Router();
var crypto = require('../../common/encrypt');
var RestMsg = require('../../common/restmsg'); // 引用restmsg模块
var UserService = require('../../service/user/userservice'); // 引用UserService模块

/**
 * 访问首页
 */
router.get('/', function (req, res) {
    var restmsg = new RestMsg();
    if (req.session.uid) {
        //已登录
        UserService.getById(req.session.uid, function (err, bo) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (bo) {
                bo = bo.toObject();
                delete bo.password;
                bo.phone = (bo.phone ? bo.phone : '');
                res.render('admin', {"title": "Admin", "user": bo, "url": ""});
            }
        });
    } else {
        res.redirect('/admin/login');
    }
});

/**
 * 注册
 */
router.route('/register')
    .get(function (req, res) {
        var restmsg = new RestMsg();
        if (req.session.uid) {
            res.redirect('/admin/login');
        } else {
            UserService.count({}, function (err, count) {
                if (err) {
                    restmsg.errorMsg(err);
                    res.send(restmsg);
                    return;
                }
                if (count) {
                    res.redirect('/admin/login');
                } else {
                    res.render('register', {"title": "Register", "msg": ""});
                }
            });
        }
    })

    .post(function (req, res) {
        var restmsg = new RestMsg();
        if (req.body.nickname && req.body.pwd && req.body.username && req.body.email && req.body.repwd) {
            var password = req.body.pwd;
            var repwd = req.body.repwd;

            //输入密码是否一致
            if (password != repwd) {
                res.render('register', {"title": "Register", "msg": "两次输入密码不一致！"});
                return;
            }
            var user = {};
            user.nickname = req.body.nickname;
            user.username = req.body.username;
            user.password = crypto.sha1Hash(req.body.pwd);
            user.email = req.body.email;
            user.phone = req.body.phone;

            UserService.count({username: user.username}, function (err, count) {
                if (err) {
                    restmsg.errorMsg(err);
                    res.send(restmsg);
                    return;
                }
                if (!count) {
                    UserService.save(user, function (err, obj) {
                        if (err) {
                            res.render('register', {"title": "Register", "msg": "注册失败，请重试！"});
                        }
                        if (obj) {
                            req.session.uid = obj._id;
                            res.redirect('/admin/login');
                        }
                    });
                } else {
                    res.render('register', {"title": "Register", "msg": "登录名已存在！"});
                }
            });
        } else {
            res.render('register', {"title": "Register", "msg": "请完整并正确输入注册信息！"});
        }
    });

/**
 * 登录相关
 */
router.route('/login')
    .get(function (req, res) {
        var restmsg = new RestMsg();
        if (req.session.uid) {
            res.redirect('/admin')
        } else {
            res.render('login', {"title": "Login", "msg": ""});
        }
    })

    .post(function (req, res) {
        var restmsg = new RestMsg();
        UserService.count({}, function (err, count) {
            if (count) {
                if (req.body.username && req.body.pwd) {
                    var username = req.body.username;
                    var password = crypto.sha1Hash(req.body.pwd);
                    UserService.findOne({username: username, password: password}, function (err, bo) {
                        if (err) {
                            restmsg.errorMsg(err);
                            res.send(restmsg);
                            return;
                        }
                        if (bo) {
                            req.session.uid = bo["_id"];
                            res.redirect('/admin');
                        } else {
                            res.render('login', {"title": "Login", "msg": "用户名或密码错误！"});
                        }
                    });
                } else {
                    res.render('login', {"title": "Login", "msg": "请输入用户名和密码！"});
                }
            } else {
                res.redirect('/admin/register');
            }
        });

    });

/**
 * 退出登录
 */
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.uid = null;
        res.clearCookie('websit');
        req.session.destroy();
    }
    res.redirect('/admin/login')
});

/**
 * 菜单切换
 */
router.get('/category', function (req, res, next) {
    if (req.session.uid) {
        res.render('admin', {"title": "Category", "url": "/pages/my-category.html"});
    } else {
        res.redirect('/index');
    }

});

router.get('/content', function (req, res, next) {
    if (req.session.uid) {
        res.render('admin', {"title": "Content", "url": "/pages/my-content.html"});
    } else {
        res.redirect('/index');
    }
});

router.get('/images', function (req, res, next) {
    if (req.session.uid) {
        res.render('admin', {"title": "Content", "url": "/pages/my-images.html"});
    } else {
        res.redirect('/index');
    }
});

module.exports = router;