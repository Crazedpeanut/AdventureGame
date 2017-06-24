const GameEngineService = require('../service/game-engine-service');

class GameEngineServiceFactory {

    /**
     * @param {String} redisUrl
     * @param {GameEngineAdapter} gameEngineAdapter
     * @param {EventRouter} gameEngineEventRouter
     */
    constructor(redisUrl, gameEngineAdapter, gameEngineEventRouter) {
        this.redisUrl = redisUrl;
        this.gameEngineAdapter = gameEngineAdapter;
        this.gameEngineEventRouter = gameEngineEventRouter;
    }

    create() {
        return new GameEngineService(this.gameEngineAdapter, this.gameEngineEventRouter);
    }
}

module.exports = GameEngineServiceFactory;
