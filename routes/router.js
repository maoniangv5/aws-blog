var express = require('express');
var router = express.Router();
var index = require('./index/indexrouter');
var users = require('./admin/userrouter');
var category = require('./admin/categoryrouter');

router.use('/', index);
router.use('/admin', users);
router.use('/api/category', category);

module.exports = router;