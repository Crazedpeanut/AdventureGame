const GameEngineAdapter = require('../common/adapter/game-engine-adapter');
const EventFactory = require('../common/factory/event-factory');
const GameEngineRouterFactory = require('./factory/route-factory/game-engine-route-factory');
const GameClientServiceFactory = require('./factory/game-client-service-factory');
const GameClientAdapterFactory = require('./factory/game-client-adapter-factory');
const SessionRepository = require('../common/repository/session-repository/redis-session-repository');
const SessionFactory = require('../common/factory/session-factory');
const redis = require('redis');
const config = require('config');
const AuthMiddleware = require('./middleware/auth-middleware');
const AccessLogMiddleware = require('./middleware/access-log-middleware');
const EventRouterMiddleware = require('./middleware/event-router-middleware');

const sessionFactory = new SessionFactory();
const sessionRepository = new SessionRepository(redis.createClient(config.redisUrl), sessionFactory);

const gameClientAdapter = new GameClientAdapterFactory(sessionRepository).create();
const gameEngineAdpater = new GameEngineAdapter(new EventFactory());

const gameClientServiceFactory = new GameClientServiceFactory(gameEngineService, sessionRepository);
const gameClientService = gameClientServiceFactory.create();


const gameEngineRouter = new GameEngineRouterFactory(gameEngineService, gameClientService).create();

gameEngineService.gameEngineRouter = gameEngineRouter;


gameClientAdapterFactory.clientAdapter =

const eventFactory = new EventFactory();
const gameClientEventRouter = new ClientEventRouterFactory(this.gameEngineService, this.gameClientService).create();

const authMiddleware = AuthMiddleware(this.sessionRepository);
const accessLogMiddleware = AccessLogMiddleware();
const eventRouterMiddleware = EventRouterMiddleware(eventFactory, gameClientEventRouter);

clientAdapter.sessionRepository = this.sessionRepository;
clientAdapter.authMiddleWare = authMiddleware;
clientAdapter.accessLogMiddleware = accessLogMiddleware;
clientAdapter.eventRouterMiddleware = eventRouterMiddleware;



console.log('Started Game Server Node 8080');

