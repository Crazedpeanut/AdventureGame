const {Console, Events} = require('./console');
const ServerAdapter = require('./server-adapter');
const config = require('config');
const open = require('open');
const AuthEvent = require('../../common/events/auth-event');

const gameConsole = new Console(process.stdin, process.stdout);
gameConsole.isDebugMode = true;

gameConsole.on(Events.COMMAND_EVENT, (command) => {
    switch(command.commandKey) {
        case 'exit': {
            gameConsole.writeToConsole('Exiting the game.');
            process.exit(0);
        } break;
    }
});


function _handleAuthSucceeded(authSucceededEvent) {
    console.log('authSucceededEvent: ' + JSON.stringify(authSucceededEvent));
}

function _handleAuthFailed(authFailedEvent) {
    console.log('authFailedEvent: ' + JSON.stringify(authFailedEvent));
}

function _handleAuthRequired(authRequiredEvent) {
    console.log('authRequiredEvent' + JSON.stringify(authRequiredEvent));
    console.log('Opening auth webpage');
    open(`${config.authServicerUrl}?sessionId=${authRequiredEvent.sessionId}`);
}

const serverAdapter = new ServerAdapter('http://localhost:8080/');
serverAdapter.on(AuthEvent.prototype.AUTH_EVENT_KEY, (authEvent) => {

    switch(authEvent.authEventType) {
        case 'authRequired': {
            _handleAuthRequired(authEvent);
        } break;

        case 'authSucceeded': {
            _handleAuthSucceeded(authEvent);
        } break;

        case 'authFailed': {
            _handleAuthFailed(authEvent);
        } break;

        default: {
            console.error('Unknown Auth Type! ' + authEvent.authEventType)
        } break;
    }
});

serverAdapter.connect();
