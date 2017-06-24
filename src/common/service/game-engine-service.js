const AuthSucceededEvent = require('../events/auth-succeeded-event');

class GameEngineService {

    /**
     * @param {GameEngineAdapter} gameEngineAdapter
     * @param {EventRouter} gameEngineRouter
     */
    constructor(gameEngineAdapter, gameEngineRouter) {
        this._gameEngineAdapter = gameEngineAdapter;
        this._gameEngineRouter = gameEngineRouter;
    }

    sendSessionAuthenticatedSucceededEvent(sessionId) {
        this._gameEngineAdapter.sendEvent(`session.queue:${sessionId}`, '/authEvent/authSucceeded', new AuthSucceededEvent(sessionId));
    }

    listenForSessionEvents(sessionId) {
        this._gameEngineAdapter.addEventListener(`session:${sessionId}.queue`, this.gameEngineRouter);
    }

    stopListeningForSessionEvents(sessionId) {
        this._gameEngineAdapter.removeEventListener(`session:${sessionId}.queue`);
    }

    get gameEngineRouter() {
        return this._gameEngineRouter;
    }

    set gameEngineRouter(gameEngineRouter) {
        this._gameEngineRouter = gameEngineRouter;
    }
}

module.exports = GameEngineService;