const Express = require('express');
const AuthController = require('./controller/auth-controller');
const BodyParser = require('body-parser');
const SessionRepository = require('../common/repository/session-repository/redis-session-repository');
const SessionFactory = require('../common/factory/session-factory');
const Redis = require('redis');
const GameEngineServiceFactory = require('../common/factory/game-engine-service-factory');
const config = require('config');

const express = Express();
const gameEngineService = new GameEngineServiceFactory(config.redisUrl).create();
const redisClient = Redis.createClient();
const sessionRepository = new SessionRepository(redisClient, new SessionFactory());
const authController = new AuthController(sessionRepository, gameEngineService);

// parse application/x-www-form-urlencoded
express.use(BodyParser.urlencoded({ extended: false }));

// parse application/json
express.use(BodyParser.json());

express.post('/session/:sessionId/authenticate', (req, res) => authController.handleSessionAuthentication(req, res));

express.listen(8081);
console.log('Started auth gateway. listening on port 8081');