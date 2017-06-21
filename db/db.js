var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/aws-blog');

module.exports = mongoose;
