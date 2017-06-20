/**
 * Created by duanying on 2017/5/18.
 */
let express = require('express');
let router = express.Router();
let RestMsg = require("../../common/restmsg");
let Channel = require("../../service/channel/model/channelbo");
let channelService = require("../../service/channel/channelservice");
let contentlService = require("../../service/content/contentservice");
var fs = require('fs');
var multer = require('multer');
var config = require("../../config/config");

//初始化multer
var mwMulter1 = multer({
    dest: config.imgs_config.imgs
});

router.route("/")
    /**
     * api 2.2 获取栏目列表
     */
    .get(function(req, res, next) {
        let restmsg = new RestMsg();
        channelService.find(function(err, channels) {
            if (err) return next(err);
            restmsg.successMsg();
            restmsg.setResult(channels);
            return res.send(restmsg);
        })
    })
    /**
     * api2.1 栏目新增
     */
    .post(function(req, res, next) {
        let content = { name, p_id, is_menu, is_display, show_index, order, type, relation, desc } = req.body,
            restmsg = new RestMsg();
        // 校验数据
        let errormsg = "";
        if (!name) {
            errormsg += "栏目名不能为空,"
        }
        if (!p_id) {
            errormsg += "父栏目ID不能为空 "
        }
        if (!is_menu) {
            errormsg += "是否为菜单不能为空 "
        }
        if (!is_display) {
            errormsg += "是否展示不能为空 "
        }
        if (!show_index) {
            errormsg += "是否展示在首页不能为空 "
        }
        if (!order) {
            errormsg += "顺序不能为空 "
        }
        if (!type) {
            errormsg += "栏目类型不能为空 "
        }

        if (errormsg.length > 0) {
            restmsg.errorMsg(errormsg);
            return res.send(restmsg);
        }
        // 重名校验
        channelService.findOne({ p_id, name }, function(err, channel) {
            if (err) return next(err)
            if (channel) {
                restmsg.errorMsg("与当前级栏目重名!");
                return res.send(restmsg);
            }
            // 新建栏目
            channelService.save(content, function(err, channel) {
                if (err) return next(err);
                restmsg.successMsg();
                return res.send(restmsg);
            })
        })
    })

router.route("/:cid")
    /**
     * 修改栏目 api 2.3 
     */
    .put(function(req, res, next) {
        let _id = req.params.cid;
        // 获取当前栏目
        channelService.findOne({ _id }, function(err, channel) {
            if (err) return next(err);
            let restmsg = new RestMsg();
            if (!channel) {
                restmsg.errorMsg("栏目不存在");
                return res.send(restmsg);
            }
            // 栏目存在
            let content = { name, p_id, is_menu, is_display, show_index, order, type, relation, desc } = req.body;
            for (let item in content) {
                channel[item] = content[item] || channel[item]
            }
            channel.save(function(err, channel) {
                if (err) return next(err);
                restmsg.successMsg();
                return res.send(restmsg);
            })
        })

    })
    /**
     * 删除栏目 2.4 
     */
    .delete(function(req, res, next) {
        let _id = req.params.cid;
        let restmsg = new RestMsg();
        channelService.findOne({
            _id
        }, function(err, channel) {
            if (err) return next(err);
            if (!channel) {
                restmsg.errorMsg("栏目不存在!");
                return res.send(restmsg);
            }
            // 查询子栏目
            channelService.findAndRemove({
                "$or": [{
                    _id
                }, {
                    relation: new RegExp(channel.relation + "." + channel._id)
                }]
            }, function(err, channels) {
                if (err) return next(err);
                if (channels.length == 0) {
                    restmsg.errorMsg("栏目不存在");
                    res.send(restmsg);
                }
                let channelIds = channels.map(function(channel) {
                    return channel._id;
                });
                    // 删除内容
                contentlService.remove({
                    c_id: {
                        "$in": channelIds
                    }
                }, function(err) {
                    if (err) {
                        // 回退栏目删除
                        channelService.save(channels, function(err) {
                            if (err) {
                                restmsg.errorMsg("回退栏目删除失败")
                                res.send(restmsg);
                            } else {
                                restmsg.errorMsg("栏目内容删除失败, 栏目删除 回退成功");
                                res.send(restmsg);
                            }
                        })
                    } else {
                        restmsg.successMsg();
                        res.send(restmsg);
                    }
                })
            })
        })
    })

router.route("/imgs")
    .post(mwMulter1, function(req, res, next) { // 上传图片API
        if (!fs.existsSync(config.imgs_config.imgs)) {
            fs.mkdirSync(config.imgs_config.imgs);
        }
        var restmsg = new RestMsg();
        var files = req.files.file;
        var obj = {};
        // 拼接访问地址：/images/xxxxx.xx
        obj.url = '/'+files.path.split('\\').splice(files.path.split('\\').length-2).join('/')
        restmsg.successMsg();
        restmsg.setResult(obj);
        res.send(restmsg);
    });

module.exports = router;