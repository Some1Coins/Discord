// commands/history.js
const { CryptoHistory } = require('../models/CryptoHistory');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'history',
    description: 'Affiche l\'historique des modifications pour une adresse donnée.',
    async execute(message, args) {
        const address = args[0];
        const history = await CryptoHistory.findAll({ where: { address }, order: [['timestamp', 'DESC']] });

        if (history.length === 0) {
            const noHistoryEmbed = new EmbedBuilder()
                .setColor(0xffa500)
                .setDescription(`📋 **__Pas d'historique__**\n\nAucune modification n'a été enregistrée pour l'adresse \`${address}\`.`);
            return message.reply({ embeds: [noHistoryEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle(`__**🕒 Historique des modifications pour ${address}**__`)
            .setDescription(
                history.map(h => `**${h.action}** par **${h.user}** le ${new Date(h.timestamp).toLocaleString()}`).join('\n')
            );

        message.reply({ embeds: [embed] });
    },
};
