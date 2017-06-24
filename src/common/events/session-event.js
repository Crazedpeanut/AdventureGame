const Event = require('./event');

class SessionEvent extends Event {
    constructor(sessionEventType) {
        super('sessionEvent');
        this.sessionEventType = sessionEventType;
    }

    getEventPath() {
        return `${super.getEventPath()}/${this.sessionEventType}`;
    }
}

module.exports = SessionEvent;