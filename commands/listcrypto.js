// commands/listcrypto.js
const { CryptoAddress } = require('../models/CryptoAddress');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'listcrypto',
    description: 'Liste toutes les adresses crypto enregistrées.',
    async execute(message) {
        try {
            // Récupérer toutes les adresses depuis la base de données
            const addresses = await CryptoAddress.findAll();

            if (addresses.length === 0) {
                // Si aucune adresse n'est trouvée, envoyer un message informatif
                const noAddressesEmbed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setDescription('📋 **__Aucune adresse enregistrée__**\n\nIl n\'y a aucune adresse crypto enregistrée pour le moment.');
                return message.reply({ embeds: [noAddressesEmbed] });
            }

            // Construire l'embed pour lister toutes les adresses
            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('__**📜 Liste des adresses crypto**__')
                .setDescription(
                    addresses.map((address, index) => `**${index + 1}.** ${address.address}`).join('\n')
                );

            // Envoyer la liste des adresses dans un embed
            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la récupération des adresses:', error);
            // Envoyer un message d'erreur si quelque chose ne va pas
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription('❌ **__Erreur__**\n\nUne erreur est survenue lors de la récupération des adresses.');
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
