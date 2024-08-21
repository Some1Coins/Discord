// commands/crypto.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'crypto',
    description: 'Affiche les commandes disponibles pour gérer les adresses crypto.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('__**📋 Commandes Crypto**__')
            .setDescription(
                '**➕ Ajouter une adresse crypto**\n`!addcrypto [adresse]`\n\n' +
                '**📋 Lister les adresses crypto**\n`!listcrypto`\n\n' +
                '**🗑️ Supprimer une adresse crypto**\n`!removecrypto [adresse]`\n\n' +
                '_Utilisez les réactions ci-dessous pour exécuter ces commandes._'
            )
            .setFooter({ text: 'Commandes crypto' });

        const embedMessage = await message.channel.send({ embeds: [embed] });

        await embedMessage.react('➕'); // Pour !addcrypto
        await embedMessage.react('📋'); // Pour !listcrypto
        await embedMessage.react('🗑️'); // Pour !removecrypto

        const filter = (reaction, user) => {
            return ['➕', '📋', '🗑️'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collector = embedMessage.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', async (reaction, user) => {
            await reaction.users.remove(user.id);

            if (reaction.emoji.name === '➕') {
                message.reply('📝 **__Adresse à ajouter ?__**\n\nVeuillez entrer l\'adresse crypto :');
                const filter = response => response.author.id === message.author.id;
                const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
                const address = collected.first().content;
                const addCryptoCommand = message.client.commands.get('addcrypto');
                if (addCryptoCommand) {
                    addCryptoCommand.execute(message, [address]);
                }
            } else if (reaction.emoji.name === '📋') {
                const listCryptoCommand = message.client.commands.get('listcrypto');
                if (listCryptoCommand) {
                    listCryptoCommand.execute(message);
                }
            } else if (reaction.emoji.name === '🗑️') {
                const removeCryptoCommand = message.client.commands.get('removecrypto');
                if (removeCryptoCommand) {
                    removeCryptoCommand.execute(message);
                }
            }
        });

        collector.on('end', () => {
            embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
        });
    },
};
