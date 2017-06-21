var express = require('express');
var router = express.Router();
var RestMsg = require("../../common/restmsg");
var CategoryService = require("../../service/category/categoryservice");

router.route('/')

    .get(function (req, res, next) {
        var restmsg = new RestMsg();
        CategoryService.find(function (err, obj) {
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

    .post(function (req, res, next) {
        var restmsg = new RestMsg();
        var content = { // content对象
            'name': req.body.name,
            'simple': req.body.simple.split(' ').join('-'),
            'is_pub': req.body.is_pub,
            'is_remove': req.body.is_remove,
            'desc': req.body.desc,
            'style': req.body.style
        }

        CategoryService.save(content, function (err, obj) {
            if (err) {
                console.log(err)
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            restmsg.successMsg();
            restmsg.setResult(obj);
            res.send(restmsg);
        })
    })

module.exports = router;