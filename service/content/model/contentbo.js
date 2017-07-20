var mongoose = require('../../../db/db');

// 定义栏目bo
var contentSchema = mongoose.Schema({
    'title': {
        type: String,
        required: true
    }, // 标题
    'simple': {
        type: String,
        required: true
    }, // 英文简称
    'category': {
        type: String,
        required: true
    }, // 类别
    'content': {
        type: String,
        required: true
    }, // 内容
    'img': {
        type: String,
        required: true
    }, // 封面url
    'tags': {
        type: Array,
        required: true
    }, // 标签
    'is_pub': {
        type: Boolean,
        required: true
    }, // 是否展示
    'is_remove': {
        type: Boolean,
        required: true
    } // 是否可删除
}, {
    "timestamps": {
        createdAt: 'created_at', //创建时间
        updatedAt: 'update_at' //修改时间
    },
    versionKey: false
});

module.exports = mongoose.model('content', contentSchema, "content");