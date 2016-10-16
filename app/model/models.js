var UserMeta = require('./User.js'),
    connection = require('../sequelize.js')

var User = connection.define('users', UserMeta.attributes, UserMeta.options)

// you can define relationships here
User.sync();
module.exports.User = User