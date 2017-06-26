class GameEngineService {

    /**
     * @param {GameEngineAdapter} gameEngineAdapter
     * @param {Router} gameEngineRouter
     */
    constructor(gameEngineAdapter, gameEngineRouter) {
        this._gameEngineAdapter = gameEngineAdapter;
        this._gameEngineRouter = gameEngineRouter;
    }

    async addToSessionJobQueue(sessionId, event) {
        return this._gameEngineAdapter.sendEvent(`game.engine.session:${sessionId}.queue`, event.eventPath, event);
    }

    listenForSessionEvents(sessionId) {
        return this._gameEngineAdapter.addJobQueueListener(`game.engine.session:${sessionId}.queue`, this._gameEngineRouter);
    }

    stopListeningForSessionEvents(sessionId) {
        return this._gameEngineAdapter.removeJobQueueListener(`game.client.session:${sessionId}.queue`);
    }

    addSessionEvent(sessionId, event) {
        return this._gameEngineAdapter.addJobToJobQueue(`game.client.session:${sessionId}.queue`, event);
    }
}

module.exports = GameEngineService;