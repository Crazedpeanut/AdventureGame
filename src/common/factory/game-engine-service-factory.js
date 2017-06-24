const GameEngineService = require('../service/game-engine-service');

class GameEngineServiceFactory {

    /**
     * @param {GameEngineAdapter} gameEngineAdapter
     * @param {GameEngineRouter} gameEngineRouter
     */
    constructor(gameEngineAdapter, gameEngineRouter) {
        this.gameEngineAdapter = gameEngineAdapter;
        this.gameEngineRouter = gameEngineRouter;
    }

    create() {
        return new GameEngineService(this.gameEngineAdapter, this.gameEngineRouter);
    }
}

module.exports = GameEngineServiceFactory;
