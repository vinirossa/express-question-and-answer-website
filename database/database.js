const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','q1w2e3r4@',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection

