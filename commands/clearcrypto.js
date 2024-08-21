// commands/clearcrypto.js
const { CryptoAddress } = require('../config/database');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clearcrypto',
    description: 'Réinitialise la base de données en supprimant toutes les adresses crypto.',
    async execute(message) {
        try {
            await CryptoAddress.destroy({ where: {}, truncate: true });

            const successEmbed = new EmbedBuilder()
                .setColor(0x0000ff)
                .setDescription('🧹 **Base de données réinitialisée**\n\nToutes les adresses ont été supprimées.');
            message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription('❌ **Erreur**\n\nUne erreur est survenue lors de la réinitialisation de la base de données.');
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
