const GameClientAdapter = require('../game-client-adapter');
const AuthMiddleware = require('../middleware/auth-middleware');
const AccessLogMiddleware = require('../middleware/access-log-middleware');
const EventRouterMiddleware = require('../middleware/event-router-middleware');
const SocketResolverService = require('../service/socket-resolver-service');
const EventFactory = require('../../common/factory/event-factory');
const ClientEventRouterFactory = require('../factory/route-factory/game-engine-route-factory');
const GameClientService = require('../service/game-client-service');

class GameClientServiceFactory {

    constructor(gameEngineService, sessionRepository, clientAdapter) {
        this.gameEngineService = gameEngineService;
        this.sessionRepository = sessionRepository;
        this.clientAdapter = clientAdapter;
    }

    create() {

        const clientAdapter = new GameClientAdapter();
        const socketResolverService = new SocketResolverService(this.sessionRepository, clientAdapter);

        const gameClientService = new GameClientService(this.sessionRepository, socketResolverService, clientAdapter);

        const eventFactory = new EventFactory();
        const gameClientEventRouter = new ClientEventRouterFactory(this.gameEngineService, this.gameClientService).create();

        const authMiddleware = AuthMiddleware(this.sessionRepository);
        const accessLogMiddleware = AccessLogMiddleware();
        const eventRouterMiddleware = EventRouterMiddleware(eventFactory, gameClientEventRouter);

        clientAdapter.sessionRepository = this.sessionRepository;
        clientAdapter.authMiddleWare = authMiddleware;
        clientAdapter.accessLogMiddleware = accessLogMiddleware;
        clientAdapter.eventRouterMiddleware = eventRouterMiddleware;

        return gameClientService;
    }
}

module.exports = GameClientServiceFactory;