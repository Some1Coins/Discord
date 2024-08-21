// commands/removetag.js
const { CryptoAddress } = require('../models/CryptoAddress');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removetag',
    description: 'Supprime un tag d\'une adresse crypto.',
    async execute(message, args) {
        const address = args[0];
        const tag = args.slice(1).join(' ');

        const cryptoAddress = await CryptoAddress.findOne({ where: { address } });

        if (!cryptoAddress) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription('❌ **__Erreur__**\n\nAdresse non trouvée.');
            return message.reply({ embeds: [errorEmbed] });
        }

        let tags = cryptoAddress.tags ? cryptoAddress.tags.split(',') : [];
        if (tags.includes(tag)) {
            tags = tags.filter(t => t !== tag);
            cryptoAddress.tags = tags.join(',');
            await cryptoAddress.save();
        }

        const successEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(`✅ **__Tag supprimé__**\n\nLe tag \`${tag}\` a été supprimé de l'adresse \`${address}\`.`);
        message.reply({ embeds: [successEmbed] });
    },
};
