/**
 * Created by lijiaxing on 2017/5/22.
 */

/**
 * 内容BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');

// 定义用户集合的结构
var contentSchema = mongoose.Schema({
    'c_id': {
        type: String,
        required: true
    }, // 栏目id
    'title': {
        type: String,
        required: true
    }, // 文字标题
    'img': String, // 图片路径（栏目类型为img或person时必输）
    'url': String, // 跳转路径（栏目类型为href时必输）
    'person': {
        name: String, // 姓名
        honor: String // 头衔
    }, // 任务信息
    'content': String, // 文档内容
    'desc': String, // 描述
    'is_display': {
        type: Boolean,
        required: true
    }, // 是否显示（true显示，false不显示）
    'order': {
        type: Number,
        required: true
    }, // 顺序，值越大排列越靠前，默认0
    'times': {
        type: Number,
        required: true
    } // 浏览次数，默认0
}, {
    "timestamps": {
        createdAt: 'created_at', //创建时间
        updatedAt: 'updated_at' //修改时间
    },
    versionKey: false
});

var content = mongoose.model('contents', contentSchema); // 将定义好的结构封装成model

module.exports = content; // 导出userbo模块