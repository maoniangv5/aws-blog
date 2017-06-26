var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/aws-blog', {useMongoClient: true});

module.exports = mongoose;
