var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/websit');
console.log('mongod')

module.exports = mongoose;
