/**
 * 栏目服务层
 * @type {user|exports}
 */
var Channel = require('./model/channelbo');
var ServiceGenerator = require('../common/servicegenerator');

var ChannelService = ServiceGenerator.generate(Channel, '_id');

/**
 * 查询并删除
 */
ChannelService.findAndRemove = function(query, cb) {
    Channel.find(query, function(err, channels) {
        if (err) return cb(err);
        Channel.remove(query, function(err) {
            if (err) return cb(err);
            cb(null, channels);
        })
    })
}

module.exports = ChannelService; // ChannelService