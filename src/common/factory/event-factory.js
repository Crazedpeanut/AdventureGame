const AuthSucceededEvent = require('../events/auth-succeeded-event');
const AuthRequiredEvent = require('../events/auth-required-event');

class EventFactory {
    createEvent(eventName, eventData) {
        switch(eventName) {
            case 'authEvent': return this._createAuthEvent(eventData.authEventType, eventData);
            default: {
                console.log('Unknown event: ' + eventName);
            }
        }
    }

    _createAuthEvent(authEventType, authEvent) {
        switch(authEventType) {
            case 'authSucceeded': return new AuthSucceededEvent(authEvent.sessionId);
            case 'authRequired': return new AuthRequiredEvent(authEvent.sessionId);
            default: console.log('unknown auth event type! ' + authEventType);
        }
    }
}

module.exports = EventFactory;