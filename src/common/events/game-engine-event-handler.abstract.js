const EventHandler = require('../../common/event-router/event-handler.interface');

class GameEngineEventHandler extends EventHandler {

    /**
     * @param {GameEngineService} gameEngineService
     * @param {GameClientService} gameClientService
     */
    constructor(gameEngineService, gameClientService) {
        super();
        this.gameEngineService = gameEngineService;
        this.gameClientService = gameClientService;
    }
}

module.exports = GameEngineEventHandler;