const SessionEvent = require('./session-event');

class SessionTokenCreatedEvent extends SessionEvent {
    constructor(signedSessionToken) {
        super('sessionTokenCreated');
        this.encodedSessionToken = signedSessionToken;
    }
}

module.exports = SessionTokenCreatedEvent;