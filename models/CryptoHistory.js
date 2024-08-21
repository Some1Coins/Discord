// models/CryptoHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CryptoHistory = sequelize.define('CryptoHistory', {
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING, // "ajoutée", "supprimée", "tag ajouté", "tag supprimé"
        allowNull: false,
    },
    user: {
        type: DataTypes.STRING, // user tag, e.g., "User#1234"
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = CryptoHistory;
