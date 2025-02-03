const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_READ,
    dialect: 'mysql',
    logging: false,
    dialectOptions: { connectTimeout: 60000 },
    pool: { max: 10, min: 0, acquire: 60000, idle: 10000 }
});

sequelize.authenticate()
    .then(() => console.log('✅ Conexión exitosa a la base de datos!'))
    .catch(err => console.error('❌ Error conectando a la base de datos:', err));

module.exports = sequelize;
