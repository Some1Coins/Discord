// commands/addcrypto.js
const { CryptoAddress } = require('../models/CryptoAddress');
const { EmbedBuilder } = require('discord.js');

// ID du canal de logs
const logChannelId = '1275544164624371833';

module.exports = {
    name: 'addcrypto',
    description: 'Ajoute une adresse crypto à la base de données.',
    async execute(message, args) {
        const address = args[0];

        if (!address) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription('❌ **__Erreur__**\n\nVeuillez fournir une adresse crypto valide.')
                .setFooter({ text: 'Format : !addcrypto [adresse]' });
            return message.reply({ embeds: [errorEmbed] });
        }

        // Vérification du format de l'adresse
        const isEthereum = /^0x[a-fA-F0-9]{40}$/.test(address);
        const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        const isTron = /^T[a-zA-Z0-9]{33}$/.test(address);

        if (!isEthereum && !isSolana && !isTron) {
            const invalidFormatEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription('❌ **__Erreur__**\n\nL\'adresse fournie n\'est pas au format valide pour les réseaux Ethereum, Solana, ou Tron.')
                .setFooter({ text: 'Veuillez vérifier le format de l\'adresse.' });
            return message.reply({ embeds: [invalidFormatEmbed] });
        }

        try {
            // Ajout de l'adresse dans la base de données
            await CryptoAddress.create({ address });

            const successEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setDescription(`✅ **__Adresse ajoutée__**\n\nL'adresse \`${address}\` a été ajoutée avec succès à la base de données.`);
            await message.reply({ embeds: [successEmbed] });

            // Enregistrement dans l'historique des logs
            const logEmbed = new EmbedBuilder()
                .setColor(0x95a5a6)
                .setDescription(`➕ **__Ajout d'adresse__**\n\nL'utilisateur **${message.author.tag}** a ajouté l'adresse \`${address}\`.`);

            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) logChannel.send({ embeds: [logEmbed] });

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicateEmbed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setDescription(`⚠️ **__Adresse déjà enregistrée__**\n\nL'adresse \`${address}\` est déjà dans la base de données.`);
                message.reply({ embeds: [duplicateEmbed] });
            } else {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription('❌ **__Erreur__**\n\nUne erreur est survenue lors de l\'ajout de l\'adresse.');
                message.reply({ embeds: [errorEmbed] });
            }
        }
    },
};
