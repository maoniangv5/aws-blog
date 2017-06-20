/**
 * Created by lijaixing on 2017/5/22.
 *
 * 内容模块服务层
 * @type {user|exports}
 */


var Content = require('./model/contentbo');
var ServiceGenerator = require('../common/servicegenerator');

var ContentService = ServiceGenerator.generate(Content, '_id');

module.exports = ContentService; // 导出ContentService模块