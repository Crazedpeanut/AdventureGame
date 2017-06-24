const Event = require('./event');

class GameEvent extends Event {
    constructor(eventName) {
        super();
        this.eventName = eventName;
    }
}

GameEvent.prototype.GAME_EVENT_KEY = 'gameEvent';

module.exports = GameEvent;