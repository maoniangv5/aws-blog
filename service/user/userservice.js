/**
 * 用户模块服务层
 * @type {user|exports}
 */
var User = require('./model/userbo');
var ServiceGenerator = require('../common/servicegenerator');

var UserService = ServiceGenerator.generate(User, '_id');

module.exports = UserService; // 导出UserService模块
