const AuthEvent = require('./auth-event');

class AuthEventReceived extends AuthEvent {

    constructor(authType) {
        super('authReceived');
        this.authType = authType;
    }

    validate() {}
    get userId() {}
    get authExpiryDate() {}
}

module.exports = AuthEventReceived;