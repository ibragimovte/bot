const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telega',
    'root',
    'root',
    {
        host: '213.232.228.222',
        port: '6432',
        dialect: 'postgres'
    }
)