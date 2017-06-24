const jwt = require('jsonwebtoken');

const SESSION_SECRET = 'secret';

class Session {
    constructor(sessionId, userId, authExpires, authenticated=false, worldId=0) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.authExpires = authExpires;
        this.authenticated = authenticated;
        this.worldId = worldId;
    }

    createSessionToken() {
        return jwt.sign({ sessionId: this.sessionId}, SESSION_SECRET, { expiresIn: '1h'});
    }

    static async validateSessionToken(encodedToken) {
        return await jwt.verify(encodedToken, SESSION_SECRET, (err, decoded) => {
           if(err) {
               console.log(`Error validating session token ${err.message}`);
               throw new Error(err);
           } else {
               return decoded.sessionId;
           }
        });
    }
}

module.exports = Session;