const AuthSucceededEvent = require('../models/auth-succeeded-event');
const AuthFailedEvent = require('../models/auth-failed-event');
const JwtAuthReceivedEvent = require('../models/jwt-auth-received-event');
const AuthRequiredEvent = require('../models/auth-required-event');

class EventFactory {
    createEvent(eventName, ...eventArgs) {
        switch(eventName) {
            case 'authSucceeded': return new AuthSucceededEvent();
            case 'authFailed': return new AuthFailedEvent();
            case 'authRequired': return new AuthRequiredEvent();
            case 'authReceived': return this._createAuthReceivedEvent(eventArgs);
            default: {
                console.log('Unknown event: ' + eventName);
            }
        }
    }

    _createAuthConfimedEvent() {

    }

    _createAuthReceivedEvent(...args) {
        const authType = args[0];

        switch(authType) {
            case 'jwt': return new JwtAuthReceivedEvent(args[1]);
            default: {
                console.log('Unknown authType: ' + authType);
            }
        }
    }
}