const jwt = require('jsonwebtoken');

const SECRET = 'secret';

class TokenService {

    async createToken(data, expiresIn='1h') {
        return jwt.sign(data, SECRET, { expiresIn });
    }

    async validateToken(encodedToken) {
        return await jwt.verify(encodedToken, SECRET, (err, decoded) => {
            if(err) {
                throw new Error(err);
            } else {
                return decoded;
            }
        })
    }
}

module.exports = TokenService;