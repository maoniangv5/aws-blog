var express = require('express');
var router = express.Router();
var translate = require('translate-api');

var RestMsg = require("../../common/restmsg");
var ContentService = require("../../service/content/contentservice");

router.route('/')

    .get(function (req, res, next) {
        var restmsg = new RestMsg();
        var query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        ContentService.find(query, function (err, obj) {
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
        translate.getText(req.body.title, {to: 'en'}).then(function (text) {
            simple = text.text.toLocaleLowerCase().split(' ').join('-');
            var content = { // content对象
                'title': req.body.title,
                'simple': simple,
                'category': req.body.category,
                'content': req.body.content,
                'img': req.body.img,
                'tags': req.body.tags,
                'is_pub': req.body.is_pub,
                'is_remove': req.body.is_remove
            }

            ContentService.save(content, function (err, obj) {
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