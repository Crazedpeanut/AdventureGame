const Event = require('./event');

class DuplicateSessionEvent extends Event {
    constructor(sessionId) {
        super('sessionEvent');
        this.sessionId = sessionId;
    }
}

module.exports = DuplicateSessionEvent;