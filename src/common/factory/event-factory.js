const AuthSucceededEvent = require('../models/auth-succeeded-event');
const AuthFailedEvent = require('../models/auth-failed-event');
const JwtAuthReceivedEvent = require('../models/jwt-auth-received-event');
const AuthRequiredEvent = require('../models/auth-required-event');

class EventFactory {
    createEvent(eventName, eventData) {
        switch(eventName) {
            case 'authEvent': return this._createAuthEvent(eventData.authEventType, eventData);
            case 'authReceived': return this._createAuthReceivedEvent(eventData);
            default: {
                console.log('Unknown event: ' + eventName);
            }
        }
    }

    _createAuthEvent(authEventType, authEvent) {
        switch(authEventType) {
            case 'authSucceeded': return new AuthSucceededEvent();
            case 'authFailed': return new AuthFailedEvent(authEvent.reason);
            case 'authRequired': return new AuthRequiredEvent(authEvent.sessionId);
            default: console.log('unknown auth event type! ' + authEventType);
        }
    }

    _createAuthReceivedEvent(eventData) {
        switch(eventData.authType) {
            case 'jwt': return new JwtAuthReceivedEvent(eventData.encodedToken);
            default: {
                console.log('Unknown authType: ' + authType);
            }
        }
    }
}

module.exports = EventFactory;