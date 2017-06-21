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
            if (obj) { // 查询出page后封装返回
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
            'title': req.body.title,
            'img': req.body.img,
            'url': req.body.url,
            'person': req.body.person,
            'content': req.body.content,
            'desc': req.body.desc,
            'is_display': req.body.is_display,
            'order': req.body.order,
            'times': 0
        }

        // 非空校验
        if (!content.title) {
            restmsg.errorMsg('请输入文章标题');
            res.send(restmsg);
            return;
        }
        if (!content.is_display) {
            restmsg.errorMsg('请选择文章是否显示');
            res.send(restmsg);
            return;
        }
        if (!content.order) {
            restmsg.errorMsg('请输入文章排序值');
            res.send(restmsg);
            return;
        }
        CategoryService.save(content, function (err, obj) {
            if (err) {
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