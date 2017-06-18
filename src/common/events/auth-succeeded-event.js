const AuthEvent = require('./auth-event');

class AuthSucceededEvent extends AuthEvent {

    /**
     * @param {string} sessionId
     */
    constructor(sessionId) {
        super('authSucceded');
        this.sessionId = sessionId;
    }
}

module.exports = AuthSucceededEvent;