var Category = require('./model/categorybo');
var ServiceGenerator = require('../common/servicegenerator');

var CategoryService = ServiceGenerator.generate(Category, '_id');

module.exports = CategoryService; // ChannelService