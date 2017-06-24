class GameEngineService {

    /**
     * @param {GameEngineAdapter} gameEngineAdapter
     * @param {Router} gameEngineRouter
     */
    constructor(gameEngineAdapter, gameEngineRouter) {
        this._gameEngineAdapter = gameEngineAdapter;
        this._gameEngineRouter = gameEngineRouter;
    }

    async sendEvent(sessionId, event) {
        this._gameEngineAdapter.sendEvent(`game.engine.session:${sessionId}.queue`, event.eventPath, event);
    }

    listenForSessionEvents(sessionId) {
        this._gameEngineAdapter.addEventListener(`game.client.session:${sessionId}.queue`, this._gameEngineRouter);
    }

    stopListeningForSessionEvents(sessionId) {
        this._gameEngineAdapter.removeEventListener(`game.client.session:${sessionId}.queue`);
    }
}

module.exports = GameEngineService;