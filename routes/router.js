var express = require('express');
var router = express.Router();
var index = require('./index/indexrouter');
var users = require('./admin/userrouter');
var category = require('./admin/categoryrouter');
var wechat = require('./wechat/wechatrouter')
var fileupload = require('./file/fileuploadrouter');
var content = require('./admin/contentrouter');
var image = require('./file/imagerouter');

router.use('/', index);
router.use('/admin', users);
router.use('/wechat', wechat);
router.use('/api/image', image);
router.use('/api/content', content);
router.use('/api/category', category);
router.use('/api/fileupload', fileupload);

module.exports = router;