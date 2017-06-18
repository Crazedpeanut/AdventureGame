const GameEngineServiceFactory = require('./../common/factory/game-engine-service-factory');
const GameEngineRouterFactory = require('./factory/route-factory/game-engine-route-factory');
const config = require('config');

const gameEngineService = new GameEngineServiceFactory(config.redisUrl).create();

const gameClientAdapter = require('./client-adapter');

const gameEngineRouter = new GameEngineRouterFactory(gameEngineService, gameClientAdapter).create();

gameEngineService.gameEngineRouter = gameEngineRouter;


console.log('Started Game Server Node 8080');

