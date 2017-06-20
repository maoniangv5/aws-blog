var express = require('express');
var router = express.Router();
var channels = require('./admin/channel.router');
var contents = require('./admin/content.router');
var users = require('./admin/user.router');
var web = require('./web/web.router');
var customer = require('./admin/customer.router');

router.use('/', web);
router.use('/admin', users);

router.use('/api/channels', channels);
router.use('/api/channels/:cid/contents', function(req, res, next) {
    var c_id = req.params.cid;
    req.cid = c_id;
    next();
}, contents);
router.use('/api/customers', customer);

module.exports = router;