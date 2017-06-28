const SessionToken = require('../model/session-token');

class AuthService {

    /**
     * @param {String} authServiceUrl
     * @param {JsonClient} httpClient
     */
    constructor(authServiceUrl, httpClient) {
        this.authServiceUrl = authServiceUrl;
        this.httpClient = httpClient;
    }

    signToken(tokenData, expires) {

    }

    /**
     * @param {Object} encodedToken
     * @returns {SessionToken}
     */
    async verifyToken(encodedToken) {
        try {
            const tokenData = await this.httpClient.post('/token/verify', encodedToken, (err, req, res, tokenData) => {
                if(err) {
                    throw new Error(err);
                } else if(req.statusCode !== 200) {
                    throw new Error('Invalid token');
                } else {
                    return tokenData;
                }
            });

            return new SessionToken(tokenData.sessionId, tokenData.timeSigned, tokenData.expires);
        } catch(err) {
            console.error(err);
            return null;
        }
    }
}

module.exports = AuthService;