var express = require('express');
var router = express.Router();

var RestMsg = require('../../common/restmsg');
var ImageService = require('../../service/images/imagesservice');

router.route('/')
    .get(function (req, res, next) {
        var restmsg = new RestMsg();
        var query = {};
        var order = [{'_id': -1}]; // 时间逆序
        ImageService.findAndOrder(query, order, function (err, obj) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (obj) {
                restmsg.successMsg();
                restmsg.setResult(obj);
                res.send(restmsg);
                return;
            }
        })
    })

module.exports = router;