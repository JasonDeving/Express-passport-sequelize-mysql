var Sequelize = require('sequelize'),
	// sequelize = new Sequelize('database', 'user', 'password', {
 //    	host: 'localhost',
 //    	dialect: 'mysql'
 //    })
    sequelize = new Sequelize('login', 'root', '', {
    	host: 'localhost',
    	dialect: 'mysql'
    })

module.exports = sequelize
