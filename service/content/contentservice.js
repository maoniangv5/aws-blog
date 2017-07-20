var Category = require('./model/contentbo');
var ServiceGenerator = require('../common/servicegenerator');

var CategoryService = ServiceGenerator.generate(Category, '_id');

module.exports = CategoryService;