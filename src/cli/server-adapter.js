const SocketIO = require('socket.io-client');
const EventEmitter = require('events');
const GameEvent = require('./../common/models/game-event');
const AuthRequiredEvent = require('./../common/models/auth-required-event');
const JwtAuthReceivedEvent = require('./../common/models/jwt-auth-received-event');
const AuthReceivedEvent = require('./../common/models/auth-received-event');

class ServerAdapter extends EventEmitter {
    constructor(serverUrl) {
        super();
        this._serverUrl = serverUrl;
        this._connection = undefined;
    }

    connect() {
        this._connection = SocketIO.connect(this._serverUrl, {
            extraHeaders: {
                Authorization: 'Hello'
            }
        });
        this._registerEventListeners(this._connection);

        this._connection.emit(GameEvent.prototype.GAME_EVENT_KEY, new GameEvent('from client'));
    }

    _registerEventListeners(openSocket) {

        openSocket.on('connect', () => {
            console.log('Connected ');
        });

        openSocket.on('error', (err) => {
            console.log('error ' + JSON.stringify(err));
        });

        openSocket.on('connect_error', (err) => {
            console.log('connect_error ' + JSON.stringify(err));
        });

        openSocket.on('connect_timeout', () => {
            console.log('connect_timeout');
        });

        openSocket.on(GameEvent.prototype.GAME_EVENT_KEY, (event) => {
            console.log('recieved game event: ' + JSON.stringify(event));
            this.emit('event', new GameEvent(event.eventName));
        });

        openSocket.on(AuthRequiredEvent.prototype.AUTH_REQUIRED_EVENT_KEY, (event) => {
            console.log('authRequiredEvent: ' + JSON.stringify(event));

            const token = jwt.sign({
                userId: 'danky'
            }, 'secret', { expiresIn: '1h' });

            openSocket.emit(AuthReceivedEvent.prototype.AUTH_EVENT_KEY, 'jwt', new JwtAuthReceivedEvent(token));
        });
    }
}

module.exports = ServerAdapter;