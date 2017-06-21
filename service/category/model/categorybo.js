var mongoose = require('../../../db/db');

// 定义栏目bo
var categorySchema = mongoose.Schema({
    'name': {
        type: String,
        required: true
    }, // 栏目名
    'simple': {
        type: String,
        required: true
    }, // 英文简称
    'style': {
        type: String,
        required: true
    }, // 样式
    'is_pub': {
        type: Boolean,
        required: true
    }, // 是否展示
    'is_remove': {
        type: Boolean,
        required: true
    }, // 是否可删除
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

module.exports = mongoose.model('category', categorySchema, "category");