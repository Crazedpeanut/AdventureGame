const GameEngineEventHandler = require('adventure-game-common/events/game-engine-event-handler.abstract');

class AuthSucceededEventHandler extends GameEngineEventHandler {

    /**
     * @param {AuthSucceededEvent} event
     */
    handleEvent(event) {
        console.log('received auth succeededevent from engine');
        this.gameClientService.sendAuthenticationRequiredEvent(event.sessionId);
        this.socket.emit('auth/authRequired', event);
    }
}

module.exports = AuthSucceededEventHandler;
