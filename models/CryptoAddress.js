// models/CryptoAddress.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CryptoAddress = sequelize.define('CryptoAddress', {
    address: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    tags: {
        type: DataTypes.STRING, // Les tags seront stockés sous forme de chaîne séparée par des virgules
        allowNull: true,
    },
});

module.exports = { CryptoAddress };
