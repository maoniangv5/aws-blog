var express = require('express');
var router = express.Router();
var translate = require('translate-api');

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
        var simple = '';
        translate.getText(req.body.name, {to: 'en'}).then(function (text) {
            simple = text.text.toLocaleLowerCase().split(' ').join('-');
            console.log(simple)
            var content = { // content对象
                'name': req.body.name,
                'simple': simple,
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
        });

    })

module.exports = router;