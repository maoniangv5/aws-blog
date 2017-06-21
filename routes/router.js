var express = require('express');
var router = express.Router();
var index = require('./index/indexrouter');
var users = require('./admin/userrouter');

router.use('/', index);
router.use('/admin', users);

module.exports = router;