/**
 * Created by duanying on 2017/5/18.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function (req, res) {
    res.render('welcome', {"title": "Welcome"});
});

router.get('/index', function (req, res) {
    res.render('index', {"title": "Index"});
});

module.exports = router;