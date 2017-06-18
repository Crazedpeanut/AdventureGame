const GameEngineEventHandler = require('../../../../common/events/game-engine-event-handler.abstract');

class AuthSucceededEventHandler extends GameEngineEventHandler {

    /**
     * @param {AuthSucceededEvent} event
     */
    handleEvent(event) {
        console.log('sending authRequired event to client');
        this.gameClientService.sendAuthenticationRequiredEvent(event.sessionId);
        this.socket.emit('auth/authRequired', event);
    }
}

module.exports = AuthSucceededEventHandler;