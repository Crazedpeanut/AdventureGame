const AuthEvent = require('./auth-event');

class AuthRequiredEvent extends AuthEvent {
    constructor(sessionId) {
        super('authRequired');
        this.sessionId = sessionId;
    }
}

module.exports = AuthRequiredEvent;