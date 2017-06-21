/**
 * Created by duanying on 2017/5/18.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('welcome', {"title": "Welcome"});
});

router.get('/index', function (req, res) {
    res.render('index', {"title": "Index", "url": "/pages/my-blog.html"});
});

router.get('/profile', function (req, res) {
    res.render('index', {"title": "Profile", "url": "/pages/my-profile.html"});
});

router.get('/tool', function (req, res) {
    res.render('index', {"title": "Tool", "url": "/pages/my-tool.html"});
});

router.get('/photo', function (req, res) {
    res.render('index', {"title": "Photo", "url": "/pages/my-photo.html"});
});

module.exports = router;