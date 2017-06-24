const Event = require('./event');

class AuthEvent extends Event {
    constructor(authEventType) {
        super('authEvent');
        this.authEventType = authEventType;
    }
}

AuthEvent.prototype.AUTH_EVENT_KEY = 'authEvent';

module.exports = AuthEvent;