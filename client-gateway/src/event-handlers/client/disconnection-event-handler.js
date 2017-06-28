const GameClientEventHandler = require('../game-client-event-handler.abstract');

class DisconnectionEventHandler extends GameClientEventHandler {

    /**
     * @param {ClientDisconnectedEvent} event
     */
    handleEvent(event) {
       const socketId = event.socketId;

       this.gameClientEngineAdapter.deleteSession(socketId);
    }
}

module.exports = DisconnectionEventHandler;