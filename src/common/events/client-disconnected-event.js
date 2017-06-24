const Event = require('./event');

class ClientConnectedEvent extends Event {
    constructor(socketId, encodedSessionToken) {
        super('clientConnected');
        this.socketId = socketId;
        this.encodedSessionToken = encodedSessionToken;
    }
}

module.exports = ClientConnectedEvent;