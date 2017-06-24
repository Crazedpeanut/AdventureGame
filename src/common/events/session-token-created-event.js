const Event = require('./event');

class SessionTokenCreatedEvent extends Event {
    constructor(encodedSessionToken) {
        super('sessionTokenCreated');
        this.encodedSessionToken = encodedSessionToken;
    }
}

module.exports = SessionTokenCreatedEvent;