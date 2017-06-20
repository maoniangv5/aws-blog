var express = require('express');
var router = express.Router();
var crypto = require('../../common/encrypt');
var RestMsg = require('../../common/restmsg'); // 引用restmsg模块
var UserService = require('../../service/user/userservice'); // 引用UserService模块


/**
 * 访问首页
 */
router.get('/', function(req, res) {
    var restmsg = new RestMsg();
    if (req.session.uid) {
        //已登录
        UserService.getById(req.session.uid, function(err, bo) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (bo) {
                bo = bo.toObject();
                delete bo.password;
                bo.tel = (bo.tel ? bo.tel : '');
                res.render('admin/index', { "user": bo });
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
    .get(function(req, res) {
        var restmsg = new RestMsg();
        if (req.session.uid) {
            res.redirect('/admin/login');
        } else {
            UserService.count({}, function(err, count) {
                if (err) {
                    restmsg.errorMsg(err);
                    res.send(restmsg);
                    return;
                }
                if (count) {
                    res.redirect('/admin/login');
                } else {
                    res.render('admin/register', { msg: "" });
                }
            });
        }
    })
    .post(function(req, res) {
        var restmsg = new RestMsg();
        if (req.body.name && req.body.pwd && req.body.username && req.body.email && req.body.repwd) {
            var password = req.body.pwd;
            var repwd = req.body.repwd;

            //输入密码是否一致
            if (password != repwd) {
                res.render('admin/register', { msg: "两次输入密码不一致" });
                return;
            }
            var user = {};
            user.full_name = req.body.name;
            user.username = req.body.username;
            user.password = crypto.sha1Hash(req.body.pwd);
            user.email = req.body.email;
            user.tel = req.body.tel;

            UserService.count({ username: user.username }, function(err, count) {
                if (err) {
                    restmsg.errorMsg(err);
                    res.send(restmsg);
                    return;
                }
                if (!count) {
                    UserService.save(user, function(err, obj) {
                        if (err) {
                            res.render('admin/register', { msg: "注册失败，请重试！" });
                        }
                        if (obj) {
                            req.session.uid = obj._id;
                            res.redirect('/admin'); //注册完成直接登录
                        }
                    });
                } else {
                    res.render('admin/register', { msg: "登录名已存在！" });
                }
            });
        } else {
            res.render('admin/register', { msg: "请完整并正确输入注册信息！" });
        }

    });

/**
 * 登录相关
 */
router.route('/login')
    .get(function(req, res) {
        var restmsg = new RestMsg();
        if (req.session.uid) {
            res.redirect('/admin');
        } else {
            UserService.count({}, function(err, count) {
                if (count) {
                    res.render('admin/login', { msg: "" });
                } else {
                    res.redirect('/admin/register');
                }
            });
        }
    })
    .post(function(req, res) {
        var restmsg = new RestMsg();
        UserService.count({}, function(err, count) {
            if (count) {
                if (req.body.username && req.body.pwd) {
                    var username = req.body.username;
                    var password = crypto.sha1Hash(req.body.pwd);
                    UserService.findOne({ username: username, password: password }, function(err, bo) {
                        if (err) {
                            restmsg.errorMsg(err);
                            res.send(restmsg);
                            return;
                        }
                        if (bo) {
                            req.session.uid = bo["_id"];
                            res.redirect('/admin');

                        } else {
                            res.render('admin/login', { msg: "用户名或密码错误！" });
                        }
                    });
                } else {
                    res.render('admin/login', { msg: "请输入用户名和密码！" });
                }
            } else {
                res.redirect('/admin/register');
            }
        });

    });

/**
 * 退出登录
 */
router.get('/logout', function(req, res, next) {
    if (req.session) {
        req.session.uid = null;
        res.clearCookie('websit');
        req.session.destroy();
    }
    res.redirect('/admin');
});


//修改个人信息
router.post('/setting', function(req, res, next) {
    if (!req.session.uid) {
        res.redirect('/admin/login');
    }
    var user = {};
    var restmsg = new RestMsg();

    var name = req.param('name');
    var email = req.param('email');
    var tel = req.param('tel');
    if (!name) {
        restmsg.errorMsg('用户名称 必填');
        res.send(restmsg);
        return;
    }
    if (!email) {
        restmsg.errorMsg('用户邮箱 必填');
        res.send(restmsg);
        return;
    }
    user.full_name = name;
    user.email = email;
    user.tel = tel;
    UserService.update({ _id: req.session.uid }, user, function(err, obj) {
        if (err) {
            restmsg.errorMsg(err);
            res.send(restmsg);
            return;
        }
        res.send(restmsg.successMsg());
    });
});

//修改账户信息
router.post('/account', function(req, res, next) {
    if (!req.session.uid) {
        res.redirect('/admin/login');
        return;
    }
    var restmsg = new RestMsg();

    // 原密码验证
    var oldPwd = req.param('oldPwd');
    UserService.getById(req.session.uid, function(err, obj) {
        if (err) {
            restmsg.errorMsg(err);
            res.send(restmsg);
            return;
        }
        if (crypto.sha1Hash(oldPwd) === obj.password) {
            var newPwd = req.param('newPwd');
            UserService.update({ _id: req.session.uid }, { password: crypto.sha1Hash(newPwd) }, function(err, obj) {
                if (err) {
                    restmsg.errorMsg(err);
                    res.send(restmsg);
                    return;
                }
                req.session.uid = null;
                res.clearCookie('websit');
                req.session.destroy();
                restmsg.successMsg();
                res.send(restmsg)
            });
        } else {
            restmsg.errorMsg('原密码错误！');
            res.send(restmsg);
            return;
        }
    });
});

module.exports = router;