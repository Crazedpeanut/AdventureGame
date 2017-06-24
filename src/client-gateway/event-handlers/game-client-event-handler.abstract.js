const EventHandler = require('../../common/event-router/event-handler.interface');

class GameClientEventHandler extends EventHandler {

    /**
     * @param {GameClientEngineAdapter} gameClientEngineAdapter
     */
    constructor(gameClientEngineAdapter) {
        super();
        this.gameClientEngineAdapter = gameClientEngineAdapter;
    }
}

module.exports = GameClientEventHandler;