const SessionEvent = require('./session-event');

class DuplicateSessionEvent extends SessionEvent {
    constructor(sessionId) {
        super('duplicateSession');
        this.sessionId = sessionId;
    }
}

module.exports = DuplicateSessionEvent;