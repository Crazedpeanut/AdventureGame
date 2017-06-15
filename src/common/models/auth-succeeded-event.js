const AuthEvent = require('./auth-event');

class AuthSucceededEvent extends AuthEvent {
    constructor() {
        super('authSucceded');
    }
}

module.exports = AuthSucceededEvent;