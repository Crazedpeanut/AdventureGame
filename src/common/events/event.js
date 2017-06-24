class Event {
    constructor(eventName) {
        this.eventName = eventName;
    }

    getEventPath() {
        return this.eventName;
    }
}

module.exports = Event;