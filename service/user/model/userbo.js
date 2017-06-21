var mongoose = require('../../../db/db');

// 定义用户集合的结构
var userSchema = mongoose.Schema({
    'nickname': {
        type: String,
        required: true
    }, // 用户名称
    'username': {
        type: String,
        required: true
    }, // 登录名
    'password': {
        type: String,
        required: true
    }, // 密码
    'email': {
        type: String,
        required: true
    }, // 邮箱
    "phone": String//电话号码
},{
    "timestamps": {
        createdAt: 'created_at',   //创建时间
        updatedAt: 'update_at'    //修改时间
    },
    versionKey: false
});

module.exports = mongoose.model('users', userSchema, 'users');
