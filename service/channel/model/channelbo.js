/**
 * 栏目bo
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义栏目bo
var channelSchema = mongoose.Schema({
    'name': {
        type: String,
        required: true
    }, // 栏目名
    'p_id': {
        type: String,
        required: true
    }, // 父栏目id
    'is_menu': {
        type: Boolean,
        required: true
    }, // 是否是菜单
    'show_index': {
        type: Boolean,
        required: true,
    }, // 是否在首页展示
    "is_display": {
        type: Boolean,
        required: true,
    },
    "order": {
        type: Number,
        required: true,
    },
    'type': { // 栏目类型
        type: String,
        required: true,
        enum: ["img", "href", "person", "article"], //img：图片类型；href：文字连接类型；person：人物介绍；article：文章
    },
    "relation": {
        type: String,
    }, // 拼接祖宗节点的ID信息(删除父节点时方便检索子节点)在前台拼接，拼接格式一级节点为：自己的id；二级节点为：一级节点id.二级节点id
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

module.exports = mongoose.model('channel', channelSchema, "channel"); // 将定义好的结构封装成model 导出