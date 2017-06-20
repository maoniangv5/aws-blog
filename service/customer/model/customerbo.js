/**
 * 客户BO
 * @type {mongoose|exports}
 */
var mongoose = require('../../../db/db');


// 定义客户集合的结构
var customerSchema = mongoose.Schema({
    'name': {
        type: String,
        required: true
    }, // 客户名称
    'area': {
        type: String,
        required: true
    }, // 所在区域
    'province': {
        type: String,
        required: true
    }, // 省/直辖市
    'city': {
        type: String,
        // required: true
    }, // 城市/区县
    'net': {
        type: String,
    }, // 网址
    'address': {
        type: String,
    }, // 详细地址
    'linkman': {
        name: String, // 姓名
        department: String, //部门
        job: String // 职位
    },
}, {
    "timestamps": {
        createdAt: 'created_at', //创建时间
        updatedAt: 'update_at' //修改时间
    },
    versionKey: false // 版本锁
});

var customer = mongoose.model('customer', customerSchema, 'customer'); // 将定义好的结构封装成model

module.exports = customer; // 导出客户bo模块