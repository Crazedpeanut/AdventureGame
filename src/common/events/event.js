const uuid = require('uuid/v4');

class Event {
    constructor(eventName, sessionId, createdTimestamp=Date.now(), messageId=uuid()) {
        this.eventName = eventName;
        this.sessionId = sessionId;
        this.createdTimestamp = createdTimestamp;
        this.messageId = messageId;
    }

    getEventPath() {
        return this.eventName;
    }
}

module.exports = Event;