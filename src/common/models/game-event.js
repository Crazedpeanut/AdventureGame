class GameEvent {
    constructor(eventName) {
        this.eventName = eventName;
    }

    isValid() {}
}

GameEvent.prototype.GAME_EVENT_KEY = 'gameEvent';

module.exports = GameEvent;