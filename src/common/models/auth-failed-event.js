const AuthEvent = require('./auth-event');

class AuthFailedEvent extends AuthEvent {
    constructor(reason) {
        super('authFailed');
        this.reason = reason;
    }
}

module.exports = AuthFailedEvent;