const EventHandler = require('../event-router/event-handler.interface');

class GameEngineEventHandler extends EventHandler {

    /**
     * @param {GameClientEngineAdapter} gameClientEngineAdapter
     */
    constructor(gameClientEngineAdapter) {
        super();
        this.gameClientEngineAdapter = gameClientEngineAdapter;
    }
}

module.exports = GameEngineEventHandler;
