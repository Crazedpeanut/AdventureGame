const Event = require('./event');

class GameEvent extends Event {
    constructor(eventName) {
        super();
        this.eventName = eventName;
    }
}

module.exports = GameEvent;