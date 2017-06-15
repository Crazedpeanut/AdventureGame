const AuthReceivedEvent = require('./auth-received-event');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret'; //TODO: Make this actually secret

class JwtAuthReceivedEvent extends AuthReceivedEvent {
    constructor(encodedToken) {
        super('jwt');

        this._encodedToken = encodedToken;
        this._userId = undefined;
        this._authExpiry = undefined;
    }

    validate() {
        return new Promise((resolve,reject) => {
            jwt.verify(this._encodedToken, JWT_SECRET, (err, decodedToken) => {
                if(err) {
                    return reject(err);
                }

                this._userId = decodedToken.userId;
                this._authExpiry = decodedToken.exp;

                return resolve();
            })
        });
    }

    get userId() {
        return this._userId;
    }

    get authExpiryDate() {
        return this._authExpiry;
    }
}

module.exports = JwtAuthReceivedEvent;