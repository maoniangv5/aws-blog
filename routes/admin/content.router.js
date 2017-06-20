/**
 * Created by duanying on 2017/5/18.
 */
var express = require('express');
var router = express.Router();
var RestMsg = require('../../common/restmsg'); // 引用restmsg模块
var ContentBo = require('../../service/content/model/contentbo'); // 引用ContentBo
var ContentService = require('../../service/content/contentservice'); // 引用ContentService模块
var ChannelService = require('../../service/channel/channelservice'); // 引用ChannelService模块
var _privateFun = router.prototype;

// BO转VO方法
_privateFun.prsBO2VO = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret) {
            return {
                _id: ret._id,
                title: ret.title,
                img: ret.img,
                url: ret.url,
                person: ret.person,
                desc: ret.desc,
                is_display: ret.is_display,
                times: ret.times,
                order: ret.order,
                content: ret.content,
                created_at: ret.created_at,
                updated_at: ret.updated_at
            }
        }
    });
    return result;
};

router.route('/')
    /**
     * api 3.2 分页查询内容
     */
    .get(function (req, res, next) {
        var restmsg = new RestMsg();
        var c_id = req.cid; // 栏目id
        var row = req.param('row'); // 分页展示每页显示的条数
        var start = req.param('start'); // 分页展示参数
        var title = req.param('title');
        var is_display = req.param('is_display');
        var query = { // 查询条件
            c_id : c_id,
            sort : { 'order': -1, 'updated_at': -1}
        };

        if (row) {
            query.row = Number(row);
        }
        if (start) {
            query.start = Number(start);
        }
        if (title) {
            query.title = new RegExp(title);
        }
        if (is_display) {
            query.is_display = is_display;
        }

        ContentService.findList(query, function (err, page) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (page) { // 查询出page后封装返回
                var objs = page.data;
                if (objs !== null && objs.length > 0) {
                    objs = objs.map(_privateFun.prsBO2VO);
                    page.setData(objs);
                }
            }
            restmsg.successMsg();
            restmsg.setResult(page);
            res.send(restmsg);
            return;
        })
    })
    /**
     * api 3.1 创建内容
     */
    .post(function (req, res, next) {
        var restmsg = new RestMsg();
        var c_id = req.cid; // 栏目id
        var content = { // content对象
            'c_id': c_id,
            'title': req.body.title,
            'img' : req.body.img,
            'url' : req.body.url,
            'person' : req.body.person,
            'content' : req.body.content,
            'desc' : req.body.desc,
            'is_display': req.body.is_display,
            'order' : req.body.order,
            'times' : 0
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
        ChannelService.findOne({_id: c_id}, function (err, ret) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (ret.type == 'img' && !content.img) {
                restmsg.errorMsg('请输入图片路径');
                res.send(restmsg);
                return;
            }
            if (ret.type == 'url' && !content.url) {
                restmsg.errorMsg('请输入跳转路径路径');
                res.send(restmsg);
                return;
            }
            ContentService.save(content,function (err, obj) {
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
    })

router.route('/:content_id')
    /**
     * api 3.5 查询内容详情
     */
    .get(function (req, res, next) {
        var restmsg = new RestMsg();
        var content_id = req.param('content_id');

        // 返回字段
        var showOptions = {
            'c_id': 0
        }
        ContentService.findOne({_id: content_id}, function (err, ret) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (ret) { // 查询出单条数据后封装返回
                var obj = ret;
                if (obj !== null) {
                    obj = _privateFun.prsBO2VO(obj);
                    ret = obj;
                }
            }
            restmsg.successMsg();
            restmsg.setResult(ret);
            res.send(restmsg);
            return;
        })
    })
    /**
     * api 3.3 修改内容
     */
    .put(function (req, res, next) {
        var restmsg = new RestMsg();
        var content_id = req.param('content_id'); // 内容id
        var c_id = req.cid; // 栏目id
        var updateContent = { // 修改的文章内容对象
            'title': req.body.title,
            'img' : req.body.img,
            'url' : req.body.url,
            'person' : req.body.person,
            'content' : req.body.content,
            'desc' : req.body.desc,
            'is_display': req.body.is_display,
            'order' : req.body.order
        }
        // 非空校验
        if (!updateContent.title) {
            restmsg.errorMsg('请输入文章标题');
            res.send(restmsg);
            return;
        }
        if (!updateContent.is_display) {
            restmsg.errorMsg('请选择文章是否显示');
            res.send(restmsg);
            return;
        }
        ChannelService.findOne({_id: c_id}, function (err, ret) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (ret.type == 'img' && !updateContent.img) {
                restmsg.errorMsg('请输入图片路径');
                res.send(restmsg);
                return;
            }
            if (ret.type == 'url' && !updateContent.url) {
                restmsg.errorMsg('请输入跳转路径路径');
                res.send(restmsg);
                return;
            }
            ContentService.update({_id: content_id}, updateContent, function (err, obj) {
                if (err) {
                    restmsg.errorMsg(err);
                    res.send(restmsg);
                    return;
                }
                restmsg.successMsg();
                restmsg.setResult(obj);
                res.send(restmsg);
                return;
            })
        })
    })
    /**
     * api 3.4 删除内容
     */
    .delete(function (req, res, next) {
        var restmsg = new RestMsg();
        var content_id = req.param('content_id'); // 内容id

        ContentService.remove({_id: content_id}, function (err, obj) {
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