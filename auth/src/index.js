const Express = require('express');
const AuthController = require('./controller/auth-controller');
const BodyParser = require('body-parser');
const SessionRepository = require('adventure-game-common/repository/session-repository/redis-session-repository');
const SessionFactory = require('adventure-game-common/factory/session-factory');
const Redis = require('redis');
const GameEngineServiceFactory = require('adventure-game-common/factory/game-engine-service-factory');
const TokenController = require('./controller/token-controller');
const TokenService = require('./service/token-service');
const GameEngineAdapter = require('adventure-game-common/adapter/game-engine-adapter');
const EventFactory = require('adventure-game-common/factory/event-factory');
const config = require('config');

const express = Express();
const gameEngineAdapter = new GameEngineAdapter(new EventFactory(), config.redisUrl);
const gameEngineService = new GameEngineServiceFactory(gameEngineAdapter).create();
const redisClient = Redis.createClient();
const sessionRepository = new SessionRepository(redisClient, new SessionFactory());
const authController = new AuthController(sessionRepository, gameEngineService);
const tokenService = new TokenService();
const tokenController = new TokenController(tokenService);

// parse application/x-www-form-urlencoded
express.use(BodyParser.urlencoded({ extended: false }));

// parse application/json
express.use(BodyParser.json());

express.post('/session/authenticate/:provider', authController.handleSessionAuthentication.bind(authController));
express.post('token/sign', tokenController.handleTokenSign.bind(tokenController));
express.post('token/verify', tokenController.handleTokenVerify.bind(tokenController));

express.listen(8081);
console.log('Started auth gateway. listening on port 8081');