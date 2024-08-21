const axios = require('axios');

class DextoolsAPIV2 {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.headers = {
            'X-API-Key': this.apiKey,
            'accept': 'application/json',
            'User-Agent': 'API-Wrapper/0.3'
        };
        this.baseUrl = 'http://public-api.dextools.io/trial/v2';
    }

    async getTokenPrice(chain, address) {
        try {
            const response = await axios.get(`${this.baseUrl}/token/${chain}/${address}/price`, { headers: this.headers });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTokenScore(chain, address) {
        try {
            const response = await axios.get(`${this.baseUrl}/token/${chain}/${address}/score`, { headers: this.headers });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTokenMarketInfo(chain, address) {
        try {
            const response = await axios.get(`${this.baseUrl}/token/${chain}/${address}/info`, { headers: this.headers });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            console.error(`Données retournées par l'API: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
            console.error('Aucune réponse reçue:', error.request);
        } else {
            console.error('Erreur lors de la configuration de la requête:', error.message);
        }
        throw new Error('Erreur lors de la récupération des données de Dextools.');
    }
}

module.exports = DextoolsAPIV2;
