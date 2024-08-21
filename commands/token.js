const { getTokenPrice, getTokenSupply } = require('../api/heliusAPI');

module.exports = {
    name: 'token',
    description: 'Récupère les informations d\'un token sur Solana.',
    async execute(message, args) {
        const tokenAddress = args[0];

        if (!tokenAddress) {
            return message.channel.send("Veuillez fournir une adresse de token valide.");
        }

        try {
            const priceData = await getTokenPrice(tokenAddress);
            const supplyData = await getTokenSupply(tokenAddress);

            if (priceData && priceData.result && supplyData && supplyData.result) {
                const tokenDetails = `
                    **Adresse:** ${tokenAddress}
                    **Prix:** ${priceData.result.value} SOL
                    **Offre Circulante:** ${supplyData.result.circulatingSupply}
                    **Offre Totale:** ${supplyData.result.totalSupply}
                `;

                message.channel.send(tokenDetails);
            } else {
                message.channel.send(`Le token avec l'adresse ${tokenAddress} n'a pas été trouvé ou les données sont incomplètes.`);
            }
        } catch (error) {
            console.error("Erreur lors de l'exécution de la commande !token:", error);
            message.channel.send("Erreur lors de la récupération des données du token depuis Helius.");
        }
    }
};
