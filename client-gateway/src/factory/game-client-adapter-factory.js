const GameClientAdapter = require('../adapter/game-client-adapter');

class GameClientServiceFactory {

    constructor(authMiddleware, accessLogMiddleware, eventRouteMiddleware, clientConnectionHandler, clientDisconnectionHandler) {
        this.authMiddleware = authMiddleware;
        this.accessLogMiddleware = accessLogMiddleware;
        this.eventRouteMiddleware = eventRouteMiddleware;
        this.clientConnectionHandler = clientConnectionHandler;
        this.clientDisconnectionHandler = clientDisconnectionHandler;
    }

    create() {
        return new GameClientAdapter(
            this.authMiddleware,
            this.accessLogMiddleware,
            this.eventRouteMiddleware,
            this.clientConnectionHandler,
            this.clientDisconnectionHandler
        );
    }
}

module.exports = GameClientServiceFactory;