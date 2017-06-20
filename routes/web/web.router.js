/**
 * Created by duanying on 2017/5/18.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var underscore = require('underscore');
var moment = require('moment');
var channelService = require("../../service/channel/channelservice");
var contentlService = require("../../service/content/contentservice");

var Redis = require('ioredis');
var redis = {};
var config = require('../../config/config');
var pageConfig = require('../../config/config.page');
if (config.redis.isUsed) {
    redis = new Redis(config.redis.options);
}

var _privateFun = router.prototype;
//BO 转 VO 继承BO的字段方法2，并且进行相关字段的扩展和删除
_privateFun.prsChannel = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret, options) {
            return {
                id: ret._id.toString(),
                name: ret.name,
                pid: ret.p_id,
                relation: ret.relation
            }
        }
    });
    return result;
};
//BO 转 VO 继承BO的字段方法2，并且进行相关字段的扩展和删除
_privateFun.prsContent = function(obj) {
    var result = obj.toObject({
        transform: function(doc, ret, options) {
            return {
                id: ret._id.toString(),
                title: ret.title,
                time: ret.updated_at
            }
        }
    });
    return result;
};

/**
 * 请求首页数据
 */
router.get('/', function(req, res) {
    redis.get('index_info', function(err, initData) {
        if(err) {
            res.render('error', err);
        } else {
            if(initData) {
                initData = JSON.parse(initData);
                for(var i in initData) {
                    if(i != 'menus') {
                        for(var j = 0; j < initData[i].length; j++) {
                            initData[i][j].time = moment(initData[i][j].time).format('MM-DD');
                        }
                    }
                }
                res.render('index', {initData: initData, channelCfg: pageConfig.channelCfg});
            } else {
                res.render('index', {initData: {} });
            }
        }
    })
});

/**
 * 访问列表页面
 */
router.get('/channels/:cid/list', function(req, res,next) {
    var cid = req.params.cid;
    async.waterfall([
        function(callback) {
            channelService.getById(cid,function (err,channel){
                if(channel && channel.is_display){
                    callback(err,channel);
                }else{
                    callback("信息有误，请刷新重试！");
                }
            })
        },
        function(channel, callback) {
            var pid;
            if(channel.p_id != '0'){
                pid = channel.relation.split(".")[1];
            }else {
                pid = channel._id;
            }
            var query = {
                "$or": [
                    {'relation': { $regex: pid.toString() },is_display:true},
                    {_id:pid,is_display:true}
                ]
            };
            channelService.findAndOrder(query,{order:-1},function (err,channels){
                console.log(err);
                callback(err,channels);
            })
        },
        function(channels, callback) {
            contentlService.findAndOrder({c_id:cid,is_display:true},{order:-1,created_at:-1},function(err,contents){
                callback(err,channels,contents);
            })
        }
    ], function (err, channels,contents) {
        if(err){
            var error = new Error(err);
            error.status = 404;
            next(error);
        }else{
            channels = channels.map(_privateFun.prsChannel);

            //获取当前栏目
            var index = underscore.findIndex(channels, { id: cid });
            if (index >= 0) {
                var channel = channels[index];
                var root =[];
                var pids = channel.relation.split(".");

                //组装导航
                for(var g =1; g<pids.length; g++){
                    var i = underscore.findIndex(channels, { id: pids[g] });
                    if(i>=0){
                        root.push(channels[i]);
                    }
                }
                root.push(channel);

                //去除根节点
                var r_index = underscore.findIndex(channels, { relation: '0' });
                if (r_index >= 0) {
                    channels.splice(r_index,1);
                }

                redis.get('index_info', function(err, initData) {
                    if(err) {
                        var error = new Error("信息有误，请刷新重试！");
                        error.status = 404;
                        next(error);
                    } else {
                        initData = initData?JSON.parse(initData):{};
                        res.render('contents',{
                            initData:initData,
                            channelCfg: pageConfig.channelCfg,
                            cid:cid,
                            root:root,
                            channels:channels,
                            contents:contents.map(_privateFun.prsContent)
                        });
                    }
                });
            } else {
                var error = new Error("信息有误，请刷新重试！");
                error.status = 404;
                next(error);
            }
        }
    });
});

/**
 * 璁块棶鍒楄〃椤甸潰
 */
router.get('/channels/:cid/:aid', function(req, res,next) {
    var cid = req.params.cid;
    var aid = req.params.aid;
    async.waterfall([
        function(callback) {
            channelService.getById(cid,function (err,channel){
                if(channel && channel.is_display){
                    callback(err,channel);
                }else{
                    callback("信息有误，请刷新重试！");
                }
            })
        },
        function(channel, callback) {
            var pid;
            if(channel.p_id != '0'){
                pid = channel.relation.split(".")[1];
            }else {
                pid = channel._id;
            }
            var query = {
                "$or": [
                    {'relation': { $regex: pid.toString() },is_display:true},
                    {_id:pid,is_display:true}
                ]
            };
            channelService.findAndOrder(query,{order:-1},function (err,channels){
                callback(err,channels);
            })
        },
        function(channels, callback) {
            contentlService.getById(aid,function(err,content){
                if(content && content.is_display){
                    callback(err,channels,content);

                    //浏览次数+1
                    contentlService.update({_id:aid},{ $inc: { times: 1 }},function(err, obj) {});
                }else{
                    callback("信息有误，请刷新重试！");
                }
            })
        }
    ], function (err, channels,content) {
        if(err){
            var error = new Error(err);
            error.status = 404;
            next(error);
        }else{
            channels = channels.map(_privateFun.prsChannel);

            //获取当前栏目
            var index = underscore.findIndex(channels, { id: cid });
            if (index >= 0) {
                var channel = channels[index];
                var root =[];
                var pids = channel.relation.split(".");

                //组装导航
                for(var g =1; g<pids.length; g++){
                    var i = underscore.findIndex(channels, { id: pids[g] });
                    if(i>=0){
                        root.push(channels[i]);
                    }
                }
                root.push(channel);

                //去除根节点
                var r_index = underscore.findIndex(channels, { relation: '0' });
                if (r_index >= 0) {
                    channels.splice(r_index,1);
                }

                redis.get('index_info', function(err, initData) {
                    if(err) {
                        var error = new Error("信息有误，请刷新重试！");
                        error.status = 404;
                        next(error);
                    } else {
                        initData = initData?JSON.parse(initData):{};
                        res.render('content_info',{
                            initData:initData,
                            channelCfg: pageConfig.channelCfg,
                            cid:cid,
                            root:root,
                            channels:channels,
                            content:{
                                title:content.title,
                                content:content.content,
                                time:moment(content.updated_at).format('YYYY-MM-DD HH:mm:ss'),
                                times:content.times
                            }
                        });
                    }
                });

            } else {
                var error = new Error("信息有误，请刷新重试！");
                error.status = 404;
                next(error);
            }
        }
    });
});

module.exports = router;