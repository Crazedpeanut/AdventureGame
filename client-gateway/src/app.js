const GameEngineRouterFactory = require('./factory/route-factory/game-engine-route-factory');
const GameClientServiceFactory = require('./factory/game-client-service-factory');
const GameClientAdapterFactory = require('./factory/game-client-adapter-factory');
const SessionRepository = require('adventure-game-common/repository/session-repository/redis-session-repository');
const SessionFactory = require('adventure-game-common/factory/session-factory');
const AuthMiddleware = require('./middleware/auth-middleware');
const AccessLogMiddleware = require('./middleware/access-log-middleware');
const EventRouterMiddleware = require('./middleware/event-router-middleware');
const ConnectionEventHandler = require('./event-handlers/client/connection-event-handler');
const DisconnectionEventHandler = require('./event-handlers/client/disconnection-event-handler');
const GameClientEngineAdapter = require('./adapter/game-client-engine-adapter');
const GameClientRouteFactory = require('./factory/route-factory/client-route-factory');
const EventFactory = require('adventure-game-common/factory/event-factory');
const AuthService = require('adventure-game-common/service/auth-service');
const GameEngineAdapter = require('adventure-game-common/adapter/game-engine-adapter');
const GameEngineServiceFactory = require('adventure-game-common/factory/game-engine-service-factory');
const SocketIdSessionIdResolverService = require('./service/socketid-sessionid-resolver-service');
const redis = require('redis');
const config = require('config');
const RestifyClients = require('restify-clients');

const sessionFactory = new SessionFactory();
const sessionRepository = new SessionRepository(redis.createClient(config.redisCacheUrl), sessionFactory);
const gameClientEngineAdapter = new GameClientEngineAdapter();
const eventFactory = new EventFactory();
const gameClientRoutes = new GameClientRouteFactory(gameClientEngineAdapter).create();
const authService = new AuthService(config.authServiceUrl, RestifyClients.createJsonClient());
const socketIdSessionIdResolverService = new SocketIdSessionIdResolverService(sessionRepository);

const authMiddleware = AuthMiddleware(sessionRepository, gameClientEngineAdapter);
const accessLogMiddleware = AccessLogMiddleware();
const clientEventRouterMiddleware = EventRouterMiddleware(eventFactory, gameClientRoutes);
const connectionEventHandler = new ConnectionEventHandler(gameClientEngineAdapter, authService);
const disconnectionEventHandler = new DisconnectionEventHandler();

const gameClientAdapter = new GameClientAdapterFactory(
    authMiddleware,
    accessLogMiddleware,
    clientEventRouterMiddleware,
    connectionEventHandler,
    disconnectionEventHandler
).create();

const gameClientService = new GameClientServiceFactory(gameClientAdapter).create();

const gameEngineAdapter = new GameEngineAdapter(eventFactory, config.gameEngineRedisQueueUrl);
const gameEngineRouter = new GameEngineRouterFactory(gameClientEngineAdapter).create();
const gameEngineService = new GameEngineServiceFactory(gameEngineAdapter, gameEngineRouter).create();

gameClientEngineAdapter.authService = authService;
gameClientEngineAdapter.gameClientService = gameClientService;
gameClientEngineAdapter.gameEngineService = gameEngineService;
gameClientEngineAdapter.sessionRepository = sessionRepository;
gameClientEngineAdapter.socketIdSessionIdResolverService = socketIdSessionIdResolverService;

gameClientAdapter.start();

console.log('Started Game Server Node 8080');
