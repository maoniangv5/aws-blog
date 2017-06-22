var express = require('express');
var router = express.Router();
var index = require('./index/indexrouter');
var users = require('./admin/userrouter');
var category = require('./admin/categoryrouter');
var wechat = require('./wechat/wechat')

router.use('/', index);
router.use('/admin', users);
router.use('/wechat', wechat);
router.use('/api/category', category);

module.exports = router;