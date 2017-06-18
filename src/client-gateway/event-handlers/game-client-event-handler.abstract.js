const EventHandler = require('../../common/event-router/event-handler.interface');

class GameClientEventHandler extends EventHandler {

    /**
     * @param {GameEngineService} gameEngineService
     * @param {GameClientService} gameClientService
     */
    constructor(gameClientService, gameEngineService) {
        this.gameClientService = gameClientService;
        this.gameEngineService = gameEngineService;
    }
}

module.exports = GameClientEventHandler;