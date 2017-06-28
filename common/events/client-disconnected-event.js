const Event = require('./event');

class ClientDisconnectedEvent extends Event {
    constructor(socketId) {
        super('clientDisconnected');
        this.socketId = socketId;
    }
}

module.exports = ClientDisconnectedEvent;