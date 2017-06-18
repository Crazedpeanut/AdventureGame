const GameEngineService = require('../service/game-engine-service');
const GameEngineAdapter = require('../adapter/game-engine-adapter');
const EventFactory = require('../factory/event-factory');
const config = require('config');

class GameEngineServiceFactory {

    /**
     * @param {String} redisUrl
     */
    constructor(redisUrl) {
        this.redisUrl = redisUrl;
    }

    create() {
        const gameEngineAdapter = new GameEngineAdapter(new EventFactory(), config.redisUrl);
        return new GameEngineService(gameEngineAdapter);
    }
}

module.exports = GameEngineServiceFactory;
