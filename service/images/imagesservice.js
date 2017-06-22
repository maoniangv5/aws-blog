var Image = require('./model/imagesbo');
var ServiceGenerator = require('../common/servicegenerator');

var ImageService = ServiceGenerator.generate(Image, '_id');

module.exports = ImageService;