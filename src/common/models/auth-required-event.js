const AuthEvent = require('./auth-event');

class AuthRequiredEvent extends AuthEvent {
    constructor() {
        super('authRequired');
    }
}

module.exports = AuthRequiredEvent;