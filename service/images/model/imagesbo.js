var mongoose = require('../../../db/db');

// 定义栏目bo
var imsgeSchema = mongoose.Schema({
    'title': {
        type: String,
        required: true
    }, // 栏目名
    'url': {
        type: String,
        required: true
    }, // 栏目名
    'type': {
        type: String,
        required: true
    }, // 源类型
    'md5': {
        type: String
    }, // 源类型
    'is_pub': {
        type: Boolean,
        required: true
    }, // 是否公开
    "desc": {
        type: String
    } // 描述
}, {
    "timestamps": {
        createdAt: 'created_at', //创建时间
        updatedAt: 'update_at' //修改时间
    },
    versionKey: false
});

module.exports = mongoose.model('images', imsgeSchema, "images");