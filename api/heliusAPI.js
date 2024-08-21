const axios = require('axios');
const apiKey = process.env.HELIUS_API_KEY;

const heliusBaseURL = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

async function getTokenPrice(tokenAddress) {
    try {
        const response = await axios.post(heliusBaseURL, {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenPrice",
            params: [tokenAddress]
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du prix du token:', error.response ? error.response.data : error.message);
        throw new Error('Erreur lors de la récupération des données de prix de Helius.');
    }
}

async function getTokenSupply(tokenAddress) {
    try {
        const response = await axios.post(heliusBaseURL, {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenSupply",
            params: [tokenAddress]
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'offre du token:', error.response ? error.response.data : error.message);
        throw new Error('Erreur lors de la récupération des données d\'offre de Helius.');
    }
}

module.exports = {
    getTokenPrice,
    getTokenSupply
};
