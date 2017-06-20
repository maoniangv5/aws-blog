 /**
  * Created by yangy on 2017/5/23.
  */
 var later = require('later');
 var async = require('async');
 var Redis = require('ioredis');
 var config = require('../../config/config');
 var ContentService = require('../../service/content/contentservice'); // 引用ContentService模块
 var ChannelService = require('../../service/channel/channelservice'); // 引用ChannelService模块

 var redis = {};
 if (config.redis.isUsed) {
     redis = new Redis(config.redis.options);
 }

 later.date.localTime(); //设置本地时区

 var TimingService = {};

 TimingService.startTask = function () {
     var sched = later.parse.recur().every(config.dicsConfig.timeSpan).hour(); // 定时任务时间间隔
     TimingService.getInitData(function(err){  //项目启动后第一次执行（定时任务在规定时间间隔之后才开始执行）
         if (err) {
             return console.error('定时任务执行失败：' + err);
         }
     });
     var t = later.setInterval(function () { // 定时任务按定时规则执行
         TimingService.getInitData(function(err){
             if (err) {
                 return console.error('定时任务执行失败：' + err);
             }
         });
     }, sched);
 };

 TimingService.getInitData = function (callback) {
     var indexInfo = {};
     async.parallel({
         menus: function(cb1) { // 组装menus
             indexInfo.menus = [];
             ChannelService.findAndOrder({is_menu: true, is_display: true}, {'order': -1}, function(err, channels) {
                 if (err) {
                     console.error("定时任务栏目失败：" + err);
                     cb1(err);
                 }
                 if(channels.length > 0) {
                     async.map(channels, function(item, cb3) {
                         if(item.p_id == '0') {
                             var info = {};
                             info.id = item._id;
                             info.name = item.name;
                             info.child = [];
                             indexInfo.menus.push(info);
                             ChannelService.findAndOrder({is_menu: true, is_display: true, relation: '0.' + item._id}, {'order': -1}, function(err, secondchannels) {
                                 if (err) {
                                     console.error("定时任务二级栏目查询失败：" + err);
                                     cb3(err);
                                 }
                                 if(secondchannels.length > 0) {
                                     for (var i = 0; i < secondchannels.length; i++) {
                                         var secondinfo = {};
                                         secondinfo.id = secondchannels[i]._id;
                                         secondinfo.name = secondchannels[i].name;
                                         info.child.push(secondinfo);
                                     }
                                 }
                                 cb3(null);
                             })
                         } else {
                             cb3(null);
                         }
                     }, function (err) {
                         cb1(err);
                     })
                 } else {
                     cb1(null);
                 }
             })
         },
         content: function(cb2) { // 组装栏目内容
             ChannelService.find({show_index: true, is_display: true}, function(err, channels) {
                 if (err) {
                     console.error("定时任务栏目查询失败：" + err);
                     cb2(err);
                 }
                 if(channels.length > 0) {
                     async.mapSeries(channels, function(item, cb4) {
                         indexInfo[item._id] = [];
                         ContentService.findAndOrder({is_display: true, c_id: item._id}, {'order': -1, 'updated_at': -1}, function(err, contents) {
                             if (err) {
                                 console.error("定时任务栏目内容查询失败：" + err);
                                 cb4(err);
                             }
                             if(contents.length > 0) {
                                 for(var j = 0; j < contents.length; j++) {
                                     var contentInfo = {};
                                     contentInfo.id = contents[j]._id;
                                     contentInfo.title = contents[j].title;
                                     contentInfo.img = contents[j].img;
                                     contentInfo.href = contents[j].url;
                                     contentInfo.time = contents[j].updated_at;
                                     contentInfo.person = contents[j].person;
                                     indexInfo[item._id].push(contentInfo);
                                 }
                             }
                             cb4(null);
                         })
                     }, function (err) {
                         cb2(err);
                     })
                 } else {
                     cb2(null);
                 }
             })
         }
     }, function(err, results) {
         if(err) {
             callback(err);
             return console.error('定时任务组装首页信息失败：' + err);
         }
         var initData  = JSON.stringify(indexInfo);
         redis.del('index_info');
         redis.set('index_info', initData);
         console.log('定时任务执行完成');
         callback(null);
     });

 };

 module.exports = TimingService;