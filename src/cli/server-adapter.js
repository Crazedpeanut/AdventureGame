const SocketIO = require('socket.io-client');
const EventEmitter = require('events');
const GameEvent = require('./../common/events/game-event');
const EventFactory = require('../common/factory/event-factory');

const eventFactory = new EventFactory();

class ServerAdapter extends EventEmitter {
    constructor(serverUrl) {
        super();
        this._serverUrl = serverUrl;
        this._connection = undefined;
    }

    connect() {
        this._connection = SocketIO.connect(this._serverUrl);
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

        openSocket.on('gameEvent', (event) => {
            console.log('received game event: ' + JSON.stringify(event));
            const gameEvent = eventFactory.createEvent(event.eventName, event);
            this.emit(gameEvent.eventName, event);
        });

        openSocket.on('authEvent', (event) => {
            console.log('authEvent: ' + JSON.stringify(event));

            const authEvent = eventFactory.createEvent(event.eventName, event);

            this.emit(authEvent.eventName, authEvent);
        });
    }
}

module.exports = ServerAdapter;