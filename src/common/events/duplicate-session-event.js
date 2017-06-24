const Event = require('./event');

class DuplicateSessionEvent extends Event {
    constructor(sessionId) {
        super('duplicationSession');
        this.sessionId = sessionId;
    }
}

module.exports = DuplicateSessionEvent;