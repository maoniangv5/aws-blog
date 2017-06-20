/**
 * 客户服务层
 * @type {user|exports}
 */
var Customer = require('./model/customerbo');
var ServiceGenerator = require('../common/servicegenerator');

var CustomerService = ServiceGenerator.generate(Customer, '_id');

CustomerService.findByIdAndUpdate = function(id, update, opt, cb) {
    Customer.findByIdAndUpdate(id, update, opt, function(err, customer) {
        cb(err, customer);
    })
}

module.exports = CustomerService;