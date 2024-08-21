// commands/addtag.js
const { CryptoAddress } = require('../models/CryptoAddress');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'addtag',
    description: 'Ajoute un tag à une adresse crypto.',
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
        if (!tags.includes(tag)) {
            tags.push(tag);
            cryptoAddress.tags = tags.join(',');
            await cryptoAddress.save();
        }

        const successEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription(`✅ **__Tag ajouté__**\n\nLe tag \`${tag}\` a été ajouté à l'adresse \`${address}\`.`);
        message.reply({ embeds: [successEmbed] });
    },
};
