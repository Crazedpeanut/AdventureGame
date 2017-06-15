const Event = require('./event');

class AuthEvent extends Event {
    constructor(authEventType) {
        super('authEvent');
        this.authEventType = authEventType;
    }
}