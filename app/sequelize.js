var Sequelize = require('sequelize'),
    sequelize = new Sequelize('login', 'root', '', {
    	host: 'localhost',
    	dialect: 'mysql'
    })

module.exports = sequelize