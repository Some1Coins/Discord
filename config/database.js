// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Synchroniser les modèles avec la base de données
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Base de données synchronisée');
    })
    .catch(err => {
        console.error('Erreur lors de la synchronisation de la base de données:', err);
    });

module.exports = sequelize;
