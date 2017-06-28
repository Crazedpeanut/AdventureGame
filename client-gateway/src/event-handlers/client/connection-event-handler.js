const GameClientEventHandler = require('../game-client-event-handler.abstract');

class ConnectionEventHandler extends GameClientEventHandler {

    /**
     * @param {GameClientEngineAdapter} gameClientEngineAdapter
     * @param {AuthService} authService
     */
    constructor(gameClientEngineAdapter, authService) {
        super(gameClientEngineAdapter);
        this.authService = authService;
    }

    /**
     * @param {ClientConnectedEvent} event
     */
    async handleEvent(event) {
        const encodedSessionToken = event.encodedSessionToken;
        const socketId = event.socketId;
        let sessionId;

        console.log('A Client has connected. Socket Id: ' + socketId);

        if (encodedSessionToken) {
            console.log(`session token in header ${socketId} ${encodedSessionToken}`);

            try {
                const decodedToken = await this.authService.verifyToken(encodedSessionToken);
                sessionId = decodedToken.sessionId;
            } catch (err) {
                console.err('Invalid session token');
            }
        }

        this.gameClientEngineAdapter.createSession(socketId, sessionId);
    }
}

module.exports = ConnectionEventHandler;