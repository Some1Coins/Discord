// commands/removecrypto.js
const { EmbedBuilder } = require('discord.js');
const { CryptoAddress } = require('../models/CryptoAddress');


// ID du canal de logs (extrait de l'URL fournie)
const logChannelId = '1275544164624371833';

module.exports = {
    name: 'removecrypto',
    description: 'Supprime une adresse crypto de la base de données.',
    async execute(message) {
        const addresses = await CryptoAddress.findAll();

        if (addresses.length === 0) {
            const noAddressesEmbed = new EmbedBuilder()
                .setColor(0xffa500)
                .setDescription('📋 **__Aucune adresse enregistrée__**\n\nIl n\'y a aucune adresse crypto enregistrée pour le moment.');
            return message.reply({ embeds: [noAddressesEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('__**🗑️ Supprimer une adresse crypto**__')
            .setDescription(
                'Voici la liste des adresses crypto enregistrées.\n\n' +
                'Cliquez sur la réaction correspondante pour sélectionner l\'adresse à supprimer.'
            );

        addresses.forEach((address, index) => {
            embed.addFields({ name: `Adresse ${index + 1}`, value: `\`${address.address}\``, inline: false });
        });

        const embedMessage = await message.channel.send({ embeds: [embed] });

        const emojiNumbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        for (let i = 0; i < addresses.length && i < emojiNumbers.length; i++) {
            await embedMessage.react(emojiNumbers[i]);
        }

        const filter = (reaction, user) => {
            return emojiNumbers.includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collector = embedMessage.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', async (reaction, user) => {
            const index = emojiNumbers.indexOf(reaction.emoji.name);

            if (index !== -1 && addresses[index]) {
                const address = addresses[index].address;

                // Confirmation via réaction
                const confirmEmbed = new EmbedBuilder()
                    .setColor(0xffcc00)
                    .setDescription(`❗ **__Confirmation__**\n\nÊtes-vous sûr de vouloir supprimer l'adresse \`${address}\` ?\n\nCliquez sur ✅ pour confirmer ou sur ❌ pour annuler.`);

                const confirmMessage = await message.reply({ embeds: [confirmEmbed] });
                await confirmMessage.react('✅');
                await confirmMessage.react('❌');

                const confirmFilter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const confirmCollector = confirmMessage.createReactionCollector({ filter: confirmFilter, max: 1, time: 30000 });

                confirmCollector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === '✅') {
                        await CryptoAddress.destroy({ where: { address } });

                        const successEmbed = new EmbedBuilder()
                            .setColor(0x00ff00)
                            .setDescription(`✅ **__Adresse supprimée__**\n\nL'adresse \`${address}\` a été supprimée de la base de données.`);
                        await message.reply({ embeds: [successEmbed] });

                        // Enregistrement dans l'historique des logs
                        const logEmbed = new EmbedBuilder()
                            .setColor(0x95a5a6)
                            .setDescription(`🗑️ **__Suppression d'adresse__**\n\nL'utilisateur **${message.author.tag}** a supprimé l'adresse \`${address}\`.`);

                        const logChannel = message.guild.channels.cache.get(logChannelId);
                        if (logChannel) logChannel.send({ embeds: [logEmbed] });

                    } else {
                        const cancelEmbed = new EmbedBuilder()
                            .setColor(0x3498db)
                            .setDescription('🚫 **__Annulé__**\n\nLa suppression de l\'adresse a été annulée.');
                        await message.reply({ embeds: [cancelEmbed] });
                    }
                });

                confirmCollector.on('end', () => {
                    confirmMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                });
            }
        });

        collector.on('end', () => {
            embedMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
        });
    },
};
